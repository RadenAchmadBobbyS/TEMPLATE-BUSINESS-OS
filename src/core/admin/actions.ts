"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { dispatchNotification } from "@/core/notifications/dispatcher";
import { NotificationTypes } from "@/core/notifications/types";

// STEP 2 — SUPER ADMIN AUTHORIZATION
async function requireSuperAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, isSuperAdmin: true }
  });

  if (!user?.isSuperAdmin) {
    throw new Error("Forbidden: Super Admin access required.");
  }

  return user.id;
}

// STEP 12 — AUDIT LOGGING
async function logAdminAction(adminId: string, action: string, workspaceId: string, metadata?: any) {
  await prisma.auditLog.create({
    data: {
      userId: adminId,
      workspaceId,
      action,
      metadata: metadata || {},
    }
  });
}

// STEP 3 & 9 — ADMIN DASHBOARD OVERVIEW & ANALYTICS SUMMARY
export async function getPlatformMetrics() {
  await requireSuperAdmin();

  const [
    totalUsers, activeUsers, 
    totalWorkspaces, activeWorkspaces, 
    totalWebsites, publishedWebsites,
    activeSubscriptions, canceledSubscriptions
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.workspace.count(),
    prisma.workspace.count({ where: { isArchived: false, deletedAt: null } }),
    prisma.website.count(),
    prisma.website.count({ where: { deletedAt: null } }), // Assuming deletedAt=null means active/published
    prisma.subscription.count({ where: { status: "ACTIVE", planTier: { not: "FREE" } } }),
    prisma.subscription.count({ where: { status: "CANCELED" } })
  ]);

  return {
    users: { total: totalUsers, active: activeUsers },
    workspaces: { total: totalWorkspaces, active: activeWorkspaces },
    websites: { total: totalWebsites, published: publishedWebsites },
    billing: { active: activeSubscriptions, canceled: canceledSubscriptions }
  };
}

// STEP 4 & 5 — USER MANAGEMENT
export async function getAllUsers() {
  await requireSuperAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      isSuperAdmin: true,
      sessions: { select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 },
      roles: { include: { workspace: { select: { name: true } } } }
    }
  });
}

export async function toggleUserBan(userId: string, isBanned: boolean) {
  const adminId = await requireSuperAdmin();
  
  // Prevent self-ban
  if (adminId === userId) throw new Error("Cannot modify your own Super Admin status.");

  const status = isBanned ? "BANNED" : "ACTIVE";
  
  await prisma.user.update({
    where: { id: userId },
    data: { status }
  });

  const firstWorkspace = await prisma.userRole.findFirst({ where: { userId } });
  if (firstWorkspace) {
    await logAdminAction(adminId, "TOGGLE_USER_BAN", firstWorkspace.workspaceId, { status, targetUserId: userId });
  }

  await dispatchNotification({
    userId,
    type: NotificationTypes.SYSTEM_ALERT,
    title: "Account Status Changed",
    message: `Your account status has been changed to ${status} by a platform administrator.`,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

// STEP 6 — WORKSPACE MANAGEMENT
export async function getAllWorkspaces() {
  await requireSuperAdmin();
  return prisma.workspace.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      members: {
        where: { role: "OWNER" },
        include: { user: { select: { name: true, email: true } } }
      },
      subscription: true,
      _count: {
        select: { members: true, websites: true }
      }
    }
  });
}

export async function toggleWorkspaceArchive(workspaceId: string, isArchived: boolean) {
  const adminId = await requireSuperAdmin();

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { isArchived, deletedAt: isArchived ? new Date() : null }
  });

  await logAdminAction(adminId, "TOGGLE_WORKSPACE_ARCHIVE", workspaceId, { isArchived });

  // Get owners to notify
  const owners = await prisma.userRole.findMany({
    where: { workspaceId, role: "OWNER" },
    select: { userId: true }
  });

  for (const owner of owners) {
    await dispatchNotification({
      userId: owner.userId,
      workspaceId,
      type: NotificationTypes.WORKSPACE_ROLE_CHANGED, // or SYSTEM_ALERT
      title: "Workspace Status Changed",
      message: `Your workspace status has been changed to ${isArchived ? "SUSPENDED" : "ACTIVE"} by a platform administrator.`,
    });
  }

  revalidatePath("/admin/workspaces");
  return { success: true };
}

// STEP 7 — WEBSITE MANAGEMENT
export async function getAllWebsites() {
  await requireSuperAdmin();
  return prisma.website.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      workspace: {
        include: {
          members: {
            where: { role: "OWNER" },
            include: { user: { select: { name: true, email: true } } }
          }
        }
      }
    }
  });
}

// STEP 8 — BILLING ADMIN VIEW
export async function getAllSubscriptions() {
  await requireSuperAdmin();
  return prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      workspace: {
        select: { name: true, slug: true }
      }
    }
  });
}

export async function getRecentInvoices() {
  await requireSuperAdmin();
  return prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      subscription: {
        include: { workspace: { select: { name: true } } }
      }
    }
  });
}
