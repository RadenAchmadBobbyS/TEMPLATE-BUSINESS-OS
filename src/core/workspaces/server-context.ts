import { cookies } from "next/headers";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";

/**
 * Retrieves the currently active workspace for the session.
 * Uses the `workspace_id` cookie. If not set, falls back to the first available workspace.
 */
export async function getActiveWorkspace() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  
  const cookieStore = await cookies();
  let workspaceId = cookieStore.get("workspace_id")?.value;
  
  if (workspaceId) {
    // Verify the user actually has access to this workspace
    const role = await prisma.userRole.findUnique({
      where: { 
        userId_workspaceId: { 
          userId: session.user.id, 
          workspaceId 
        } 
      },
      include: { workspace: true }
    });
    
    if (!role || role.workspace.deletedAt || role.workspace.isArchived) {
      workspaceId = undefined; // Invalid cookie, fall back
    }
  }

  // If no cookie or invalid cookie, find the first workspace this user is a member of
  if (!workspaceId) {
    const defaultRole = await prisma.userRole.findFirst({
      where: { userId: session.user.id, workspace: { isArchived: false, deletedAt: null } },
      orderBy: { workspace: { createdAt: "asc" } },
      select: { workspaceId: true },
    });
    
    if (defaultRole) {
      workspaceId = defaultRole.workspaceId;
    }
  }
  
  if (!workspaceId) return null;
  
  // Verify the user actually has access to this workspace (final check)
  const role = await prisma.userRole.findUnique({
    where: { 
      userId_workspaceId: { 
        userId: session.user.id, 
        workspaceId 
      } 
    },
    include: { 
      workspace: {
        include: {
          members: {
            where: { role: 'OWNER' },
            take: 1,
            include: {
              user: {
                include: { subscription: true }
              }
            }
          }
        }
      } 
    }
  });
  
  if (!role || role.workspace.deletedAt || role.workspace.isArchived) {
    return null; 
  }
  
  const ownerSubscription = role.workspace.members[0]?.user?.subscription || null;
  const ownerId = role.workspace.members[0]?.userId || null;
  
  return { 
    workspace: role.workspace, 
    role: role.role,
    canCreateDelete: role.canCreateDelete,
    ownerSubscription,
    ownerId
  };
}

/**
 * Ensures the user has a workspace, similar to getActiveWorkspace, 
 * but throws an error instead of returning null if none is found.
 */
export async function requireActiveWorkspace() {
  const active = await getActiveWorkspace();
  if (!active) {
    throw new Error("No active workspace found or access denied.");
  }
  return active;
}

/**
 * Helper to check permissions within an active workspace context
 */
export function checkWorkspacePermission(role: string, required: "OWNER" | "ADMIN" | "EDITOR") {
  if (!hasWorkspacePermission(role, required)) {
    throw new Error(`Insufficient permissions. Required: ${required}, but got: ${role}`);
  }
}

/**
 * Non-throwing version for Server Actions to return `{ error }` instead of 500
 */
export function hasWorkspacePermission(role: string, required: "OWNER" | "ADMIN" | "EDITOR"): boolean {
  const levels = {
    "OWNER": 3,
    "ADMIN": 2,
    "EDITOR": 1
  };
  
  return levels[role as keyof typeof levels] >= levels[required];
}

/**
 * Helper to check if an Editor has the CAN_CREATE_DELETE permission
 */
export function canPerformDestructiveAction(role: string, canCreateDelete: boolean): boolean {
  if (role === "OWNER" || role === "ADMIN") return true;
  if (role === "EDITOR" && canCreateDelete) return true;
  return false;
}

/**
 * Ensures the user has an active workspace but returns an error object instead of throwing.
 * Designed specifically for Server Actions to avoid HTTP 500 on expected authorization failures.
 */
export async function requireActiveWorkspaceAction() {
  const active = await getActiveWorkspace();
  if (!active) {
    return { success: false as const, error: "No active workspace found or access denied." };
  }
  return { success: true as const, ...active };
}
