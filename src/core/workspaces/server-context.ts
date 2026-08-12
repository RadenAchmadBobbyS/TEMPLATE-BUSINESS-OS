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
    include: { workspace: true }
  });
  
  if (!role || role.workspace.deletedAt || role.workspace.isArchived) {
    return null; 
  }
  
  return { 
    workspace: role.workspace, 
    role: role.role 
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
export function checkWorkspacePermission(role: string, required: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER") {
  const levels = {
    "OWNER": 4,
    "ADMIN": 3,
    "EDITOR": 2,
    "VIEWER": 1
  };
  
  if (levels[role as keyof typeof levels] < levels[required]) {
    throw new Error(`Insufficient permissions. Required: ${required}, but got: ${role}`);
  }
}
