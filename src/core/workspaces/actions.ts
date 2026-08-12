"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers, cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createWorkspaceSchema, updateWorkspaceSchema, inviteMemberSchema } from "./schemas";
import { requireActiveWorkspace, checkWorkspacePermission } from "./server-context";
import { dispatchNotification } from "@/core/notifications/dispatcher";
import { NotificationTypes } from "@/core/notifications/types";

async function getUniqueSlug(baseName: string) {
  const slug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'workspace';
  let counter = 1;
  let uniqueSlug = slug;
  while (await prisma.workspace.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

export async function getUserWorkspaces() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const roles = await prisma.userRole.findMany({
    where: { 
      userId: session.user.id,
      workspace: { isArchived: false, deletedAt: null }
    },
    include: { workspace: true },
    orderBy: { workspace: { createdAt: "asc" } },
  });

  return roles.map(r => ({
    id: r.workspace.id,
    name: r.workspace.name,
    role: r.role,
  }));
}

export async function getAllUserWorkspaces() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const roles = await prisma.userRole.findMany({
    where: { 
      userId: session.user.id,
    },
    include: { workspace: true },
    orderBy: { workspace: { createdAt: "asc" } },
  });

  return roles.map(r => ({
    id: r.workspace.id,
    name: r.workspace.name,
    role: r.role,
    isArchived: r.workspace.isArchived,
  }));
}

export async function createWorkspace(data: any) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const parsed = createWorkspaceSchema.parse(data);
  const slug = await getUniqueSlug(parsed.name);

  const workspace = await prisma.workspace.create({
    data: {
      name: parsed.name,
      slug,
      members: {
        create: {
          userId: session.user.id,
          role: "OWNER",
        },
      },
    },
  });

  // Automatically set as active workspace
  await setActiveWorkspace(workspace.id);

  return workspace;
}

export async function updateWorkspace(data: any) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const { workspace, role } = await requireActiveWorkspace();
  checkWorkspacePermission(role, "ADMIN");

  const parsed = updateWorkspaceSchema.parse(data);

  let newSlug = workspace.slug;
  if (parsed.slug && parsed.slug !== workspace.slug) {
    newSlug = await getUniqueSlug(parsed.slug);
  }

  const updated = await prisma.workspace.update({
    where: { id: workspace.id },
    data: { 
      name: parsed.name,
      slug: newSlug,
      image: parsed.image ?? workspace.image,
    },
  });

  revalidatePath("/");
  return updated;
}

export async function archiveWorkspace() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const { workspace, role } = await requireActiveWorkspace();
  checkWorkspacePermission(role, "OWNER");

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { isArchived: true, deletedAt: new Date() },
  });

  const cookieStore = await cookies();
  cookieStore.delete("workspace_id");

  revalidatePath("/");
  return { success: true };
}

export async function restoreWorkspace(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  // Need to find if user is OWNER, but workspace might be archived so requireActiveWorkspace won't work
  const userRole = await prisma.userRole.findUnique({
    where: { userId_workspaceId: { userId: session.user.id, workspaceId: id } },
    include: { workspace: true }
  });
  if (!userRole || userRole.role !== "OWNER") throw new Error("Unauthorized or not owner");

  await prisma.workspace.update({
    where: { id },
    data: { isArchived: false, deletedAt: null },
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteWorkspace(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  const userRole = await prisma.userRole.findUnique({
    where: { userId_workspaceId: { userId: session.user.id, workspaceId: id } }
  });
  if (!userRole || userRole.role !== "OWNER") throw new Error("Unauthorized or not owner");

  await prisma.workspace.delete({
    where: { id },
  });

  const cookieStore = await cookies();
  if (cookieStore.get("workspace_id")?.value === id) {
    cookieStore.delete("workspace_id");
  }

  revalidatePath("/");
  return { success: true };
}


export async function setActiveWorkspace(workspaceId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // Verify access
  const role = await prisma.userRole.findUnique({
    where: { userId_workspaceId: { userId: session.user.id, workspaceId } },
    include: { workspace: true }
  });

  if (!role || role.workspace.deletedAt || role.workspace.isArchived) {
    throw new Error("Workspace not found or access denied");
  }

  const cookieStore = await cookies();
  cookieStore.set("workspace_id", workspaceId, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  revalidatePath("/", "layout");
}

export async function getWorkspaceMembers() {
  const { workspace, role } = await requireActiveWorkspace();
  checkWorkspacePermission(role, "VIEWER");

  const members = await prisma.userRole.findMany({
    where: { workspaceId: workspace.id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      }
    },
    orderBy: { user: { name: "asc" } }
  });

  return members;
}

export async function inviteMember(data: any) {
  const { workspace, role } = await requireActiveWorkspace();
  checkWorkspacePermission(role, "ADMIN");

  const parsed = inviteMemberSchema.parse(data);

  // Check if user is already in workspace
  const existingUser = await prisma.user.findUnique({ where: { email: parsed.email }});
  if (existingUser) {
    const existingRole = await prisma.userRole.findUnique({
      where: { userId_workspaceId: { userId: existingUser.id, workspaceId: workspace.id } }
    });
    if (existingRole) throw new Error("User is already a member of this workspace.");
  }

  // Check if invitation already exists and is pending
  const existingInvite = await prisma.workspaceInvitation.findUnique({
    where: { workspaceId_email: { workspaceId: workspace.id, email: parsed.email } }
  });
  
  if (existingInvite && existingInvite.status === "PENDING" && existingInvite.expiresAt > new Date()) {
    throw new Error("An invitation is already pending for this email.");
  }

  const token = globalThis.crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  if (existingInvite) {
    await prisma.workspaceInvitation.update({
      where: { id: existingInvite.id },
      data: { token, expiresAt, status: "PENDING", role: parsed.role }
    });
  } else {
    await prisma.workspaceInvitation.create({
      data: {
        workspaceId: workspace.id,
        email: parsed.email,
        role: parsed.role,
        token,
        expiresAt,
      }
    });
  }

  revalidatePath(`/dashboard/settings/workspace`);
  return { success: true };
}

export async function getWorkspaceInvitations() {
  const { workspace, role } = await requireActiveWorkspace();
  checkWorkspacePermission(role, "ADMIN");
  
  return prisma.workspaceInvitation.findMany({
    where: { workspaceId: workspace.id, status: "PENDING" },
    orderBy: { createdAt: "desc" }
  });
}

export async function revokeInvitation(id: string) {
  const { workspace, role } = await requireActiveWorkspace();
  checkWorkspacePermission(role, "ADMIN");
  
  await prisma.workspaceInvitation.delete({
    where: { id, workspaceId: workspace.id }
  });
  
  revalidatePath(`/dashboard/settings/workspace`);
  return { success: true };
}

export async function getPendingInvitations() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  return prisma.workspaceInvitation.findMany({
    where: { email: session.user.email, status: "PENDING" },
    include: { workspace: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function acceptInvitation(token: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  const invite = await prisma.workspaceInvitation.findUnique({
    where: { token }
  });
  
  if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
    throw new Error("Invalid or expired invitation");
  }
  
  if (invite.email !== session.user.email) {
    throw new Error("This invitation was sent to a different email address");
  }
  
  await prisma.$transaction([
    prisma.userRole.upsert({
      where: { userId_workspaceId: { userId: session.user.id, workspaceId: invite.workspaceId } },
      update: { role: invite.role },
      create: { userId: session.user.id, workspaceId: invite.workspaceId, role: invite.role }
    }),
    prisma.workspaceInvitation.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED" }
    })
  ]);
  
  revalidatePath("/");
  return { success: true, workspaceId: invite.workspaceId };
}

export async function rejectInvitation(token: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  const invite = await prisma.workspaceInvitation.findUnique({
    where: { token }
  });
  
  if (!invite || invite.status !== "PENDING") {
    throw new Error("Invalid invitation");
  }
  
  if (invite.email !== session.user.email) {
    throw new Error("Unauthorized");
  }
  
  await prisma.workspaceInvitation.update({
    where: { id: invite.id },
    data: { status: "REJECTED" }
  });
  
  revalidatePath("/");
  return { success: true };
}


export async function updateMemberRole(userId: string, newRole: "ADMIN" | "EDITOR" | "VIEWER") {
  const { workspace, role: currentUserRole } = await requireActiveWorkspace();
  checkWorkspacePermission(currentUserRole, "ADMIN");

  const targetRole = await prisma.userRole.findUnique({
    where: { userId_workspaceId: { userId, workspaceId: workspace.id } }
  });

  if (!targetRole) throw new Error("Member not found");
  if (targetRole.role === "OWNER") throw new Error("Cannot change OWNER role");

  await prisma.userRole.update({
    where: { userId_workspaceId: { userId, workspaceId: workspace.id } },
    data: { role: newRole }
  });

  await dispatchNotification({
    userId,
    workspaceId: workspace.id,
    type: NotificationTypes.WORKSPACE_ROLE_CHANGED,
    title: "Workspace Role Updated",
    message: `Your role in the workspace "${workspace.name}" has been updated to ${newRole}.`,
    actionUrl: "/dashboard",
  });

  revalidatePath(`/dashboard/settings/workspace`);
  return { success: true };
}

export async function removeMember(userId: string) {
  const { workspace, role: currentUserRole } = await requireActiveWorkspace();
  checkWorkspacePermission(currentUserRole, "ADMIN");

  const targetRole = await prisma.userRole.findUnique({
    where: { userId_workspaceId: { userId, workspaceId: workspace.id } }
  });

  if (!targetRole) throw new Error("Member not found");
  if (targetRole.role === "OWNER") throw new Error("Cannot remove OWNER from workspace");

  await prisma.userRole.delete({
    where: { userId_workspaceId: { userId, workspaceId: workspace.id } }
  });

  revalidatePath(`/dashboard/settings/workspace`);
  return { success: true };
}
