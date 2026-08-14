"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import dns from "dns";

import { requireActiveWorkspace, requireActiveWorkspaceAction, checkWorkspacePermission } from "@/core/workspaces/server-context";

async function ensureWebsiteAccess(websiteId: string, requiredRole: "OWNER" | "ADMIN" | "EDITOR" = "EDITOR") {
  const active = await requireActiveWorkspaceAction();
  if (!active.success) throw new Error(active.error);
  const { workspace, role } = active;
  checkWorkspacePermission(role, requiredRole);
  
  const website = await prisma.website.findFirst({
    where: { id: websiteId, workspaceId: workspace.id },
    include: {
      pages: {
        where: { deletedAt: null },
        include: {
          versions: {
            orderBy: { versionNumber: 'desc' },
            take: 1
          }
        }
      },
      domains: true,
    }
  });
  if (!website) throw new Error("Website not found");
  
  return website;
}

// =====================================
// DEPLOYMENT ENGINE
// =====================================

export async function deployWebsite(websiteId: string) {
  try {
    const website = await ensureWebsiteAccess(websiteId);

    // SIMULATE DEPLOYMENT TO EDGE
    const start = Date.now();
  
  // 1. Gather all state to snapshot
  const pages = website.pages;
  const settings = website.settings;
  
  const snapshot = {
    pages,
    settings,
    timestamp: new Date().toISOString()
  };

  // 2. Determine next version number
  const lastDeployment = await prisma.deployment.findFirst({
    where: { websiteId },
    orderBy: { version: 'desc' }
  });
  
  const nextVersion = (lastDeployment?.version || 0) + 1;

  const pagesToPublish = website.pages.filter(page => page.versions && page.versions.length > 0);
  const publishedPageVersionIds: string[] = [];

  // Perform database updates within a transaction
  await prisma.$transaction(async (tx) => {
    // 1. Update pages
    for (const page of pagesToPublish) {
      const latestVersion = page.versions[0];
      
      await tx.page.update({
        where: { id: page.id },
        data: {
          isPublished: true,
          publishedVersionId: latestVersion.id
        }
      });
      
      publishedPageVersionIds.push(latestVersion.id);
    }

    // 2. Update Website status
    await tx.website.update({
      where: { id: websiteId },
      data: { status: "PUBLISHED" }
    });

    // 3. Record the Deployment
    const duration = Date.now() - start;
    await tx.deployment.create({
      data: {
        websiteId,
        version: nextVersion,
        status: "SUCCESS",
        message: "Deployed successfully to edge nodes.",
        duration,
        snapshot: {
          ...snapshot,
          publishedAt: new Date().toISOString(),
          publishedPagesCount: pagesToPublish.length,
          publishedPageVersionIds
        } as any
      }
    });
  });

  const deployment = await prisma.deployment.findFirst({
    where: { websiteId, version: nextVersion }
  });

    revalidatePath(`/dashboard/${website.workspaceId}/websites/${websiteId}`);
    revalidatePath(`/builder/${websiteId}`);
    revalidatePath(`/dashboard/websites/${websiteId}/deploy`);

    return { deployment };
  } catch (error: any) {
    console.error("[DEPLOYMENT_ERROR]", error);
    return { error: error.message || "Failed to deploy website" };
  }
}

export async function clearCache(websiteId: string) {
  await ensureWebsiteAccess(websiteId);
  // Simulates clearing CDN Cache
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true, message: "Edge cache cleared globally." };
}

export async function rollbackWebsite(websiteId: string, deploymentId: string) {
  await ensureWebsiteAccess(websiteId);

  const deployment = await prisma.deployment.findUnique({
    where: { id: deploymentId }
  });

  if (!deployment || deployment.websiteId !== websiteId) {
    throw new Error("Deployment not found");
  }

  // 1. Extract Snapshot
  const snapshot = deployment.snapshot as any;
  if (!snapshot || !snapshot.pages) throw new Error("Invalid snapshot payload");

  // 2. Perform Rollback: Overwrite active DB state with snapshot
  // (In a real app with 100% DB-driven rendering, you might just point a pointer 
  // to the active deployment ID. Here we physically overwrite for the MVP to show DB state changes)
  
  await prisma.website.update({
    where: { id: websiteId },
    data: {
      settings: snapshot.settings,
    }
  });

  // (Optional: Overwrite pages if needed, omitting for brevity to prevent cascade delete issues)

  // 3. Log the Rollback as a new Deployment
  const nextVersion = await prisma.deployment.findFirst({
    where: { websiteId },
    orderBy: { version: 'desc' }
  }).then(d => (d?.version || 0) + 1);

  await prisma.deployment.create({
    data: {
      websiteId,
      version: nextVersion,
      status: "ROLLBACK",
      message: `Rolled back to v${deployment.version}`,
      duration: 500,
      snapshot: snapshot
    }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/deploy`);
  return { success: true };
}

// =====================================
// DOMAIN MANAGEMENT
// =====================================

export async function getDomains(websiteId: string) {
  await ensureWebsiteAccess(websiteId, "EDITOR");
  return prisma.domain.findMany({
    where: { websiteId },
    orderBy: { createdAt: "asc" }
  });
}

export async function addDomain(websiteId: string, hostname: string) {
  await ensureWebsiteAccess(websiteId);
  
  // Clean hostname
  const cleanHostname = hostname.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

  const existing = await prisma.domain.findUnique({
    where: { hostname: cleanHostname }
  });

  if (existing) throw new Error("Domain already in use");
  
  const verificationToken = `businessos-domain-verification=${crypto.randomUUID()}`;

  const domain = await prisma.domain.create({
    data: {
      websiteId,
      hostname: cleanHostname,
      isCustom: true,
      isVerified: false,
      sslStatus: "PENDING",
      verificationToken
    }
  });

  revalidatePath(`/dashboard/websites/${websiteId}/domains`);
  return domain;
}

export async function removeDomain(domainId: string) {
  const domain = await prisma.domain.findUnique({ where: { id: domainId } });
  if (!domain) throw new Error("Domain not found");
  await ensureWebsiteAccess(domain.websiteId);

  await prisma.domain.delete({ where: { id: domainId } });
  revalidatePath(`/dashboard/websites/${domain.websiteId}/domains`);
  return { success: true };
}

export async function verifyDomain(domainId: string) {
  const domain = await prisma.domain.findUnique({ where: { id: domainId } });
  if (!domain) throw new Error("Domain not found");
  await ensureWebsiteAccess(domain.websiteId);

  let isVerified = false;
  
  if (process.env.NODE_ENV === "development" && domain.hostname.includes("localhost")) {
    isVerified = true;
  } else {
    try {
      const records = await dns.promises.resolveTxt(domain.hostname);
      for (const record of records) {
        if (record.join("") === domain.verificationToken) {
          isVerified = true;
          break;
        }
      }
    } catch (error) {
      console.error(`Failed to resolve TXT records for ${domain.hostname}`, error);
    }
  }

  if (!isVerified) {
    throw new Error("Verification failed. TXT record not found or does not match.");
  }

  const updated = await prisma.domain.update({
    where: { id: domainId },
    data: {
      isVerified: true,
      sslStatus: "ACTIVE" // Mocking successful Let's Encrypt provisioning
    }
  });

  revalidatePath(`/dashboard/websites/${domain.websiteId}/domains`);
  return updated;
}

export async function setPrimaryDomain(domainId: string) {
  const domain = await prisma.domain.findUnique({ where: { id: domainId } });
  if (!domain) throw new Error("Domain not found");
  await ensureWebsiteAccess(domain.websiteId);

  if (!domain.isVerified) {
    throw new Error("Only verified domains can be set as primary.");
  }

  // Use transaction to ensure only one primary domain
  await prisma.$transaction([
    prisma.domain.updateMany({
      where: { websiteId: domain.websiteId, id: { not: domainId } },
      data: { isPrimary: false }
    }),
    prisma.domain.update({
      where: { id: domainId },
      data: { isPrimary: true }
    })
  ]);

  revalidatePath(`/dashboard/websites/${domain.websiteId}/domains`);
  return { success: true };
}
