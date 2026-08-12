"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireActiveWorkspace, getActiveWorkspace } from "@/core/workspaces/server-context";
import { createTicketSchema, addReplySchema, updateTicketStatusSchema, updateTicketPrioritySchema } from "./schemas";
import { dispatchNotification } from "@/core/notifications/dispatcher";
import { NotificationTypes } from "@/core/notifications/types";

// Helper: Check if user is Super Admin
async function checkSuperAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, isSuperAdmin: true } });
  if (!user?.isSuperAdmin) throw new Error("Forbidden: Super Admin access required.");
  
  return user.id;
}

// Helper: Audit Logging
async function logAdminAction(adminId: string, action: string, metadata?: any) {
  await prisma.auditLog.create({
    data: {
      userId: adminId,
      workspaceId: metadata?.workspaceId || "00000000-0000-0000-0000-000000000000", // Fallback for schema requirement
      action,
      metadata: metadata || {},
    }
  });
}

// ----------------------------------------------------
// USER ACTIONS
// ----------------------------------------------------

export async function getMyTickets() {
  const active = await getActiveWorkspace();
  if (!active) return [];
  const { workspace } = active;
  
  return prisma.ticket.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
    include: {
      assignedUser: { select: { name: true } },
      _count: { select: { replies: true } }
    }
  });
}

export async function getTicket(ticketId: string) {
  const { workspace } = await requireActiveWorkspace();
  
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId, workspaceId: workspace.id },
    include: {
      assignedUser: { select: { name: true } },
      replies: {
        where: { isInternalNote: false },
        orderBy: { createdAt: "asc" },
        include: {
          authorUser: { select: { name: true, image: true, isSuperAdmin: true } }
        }
      }
    }
  });
  
  if (!ticket) throw new Error("Ticket not found or access denied");
  return ticket;
}

export async function createTicket(data: any) {
  const { workspace } = await requireActiveWorkspace();
  const session = await auth.api.getSession({ headers: await headers() });
  const parsed = createTicketSchema.parse(data);

  const ticket = await prisma.ticket.create({
    data: {
      workspaceId: workspace.id,
      subject: parsed.subject,
      category: parsed.category,
      priority: parsed.priority,
      replies: {
        create: {
          authorUserId: session!.user.id,
          messageBody: parsed.message
        }
      }
    }
  });

  // Notify super admins
  const superAdmins = await prisma.user.findMany({ where: { isSuperAdmin: true }, select: { id: true } });
  for (const admin of superAdmins) {
    await dispatchNotification({
      userId: admin.id,
      workspaceId: workspace.id,
      type: NotificationTypes.SYSTEM_ALERT,
      title: "New Support Ticket",
      message: `A new support ticket was created in workspace ${workspace.name}: ${parsed.subject}`,
      actionUrl: `/admin/support/${ticket.id}`
    });
  }

  revalidatePath("/support");
  return ticket;
}

export async function addTicketMessage(ticketId: string, data: any) {
  const { workspace } = await requireActiveWorkspace();
  const session = await auth.api.getSession({ headers: await headers() });
  const parsed = addReplySchema.parse(data);

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId, workspaceId: workspace.id } });
  if (!ticket) throw new Error("Ticket not found");
  if (ticket.status === "CLOSED") throw new Error("Cannot reply to a closed ticket");

  await prisma.ticketReply.create({
    data: {
      ticketId: ticket.id,
      authorUserId: session!.user.id,
      messageBody: parsed.messageBody,
      isInternalNote: false
    }
  });

  // If ticket is not OPEN or IN_PROGRESS, move it to OPEN because user replied
  if (ticket.status === "RESOLVED") {
    await prisma.ticket.update({ where: { id: ticket.id }, data: { status: "OPEN" } });
  }

  revalidatePath(`/support/${ticketId}`);
  return { success: true };
}

export async function closeTicket(ticketId: string) {
  const { workspace } = await requireActiveWorkspace();

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId, workspaceId: workspace.id } });
  if (!ticket) throw new Error("Ticket not found");

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: "CLOSED", resolvedAt: new Date() }
  });

  revalidatePath(`/support/${ticketId}`);
  revalidatePath(`/support`);
  return { success: true };
}

// ----------------------------------------------------
// ADMIN ACTIONS
// ----------------------------------------------------

export async function getAdminTickets() {
  await checkSuperAdmin();
  return prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      workspace: { select: { name: true } },
      assignedUser: { select: { name: true } },
    }
  });
}

export async function getAdminTicket(ticketId: string) {
  await checkSuperAdmin();
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      workspace: { select: { name: true } },
      assignedUser: { select: { name: true, email: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          authorUser: { select: { name: true, image: true, isSuperAdmin: true } }
        }
      }
    }
  });
  if (!ticket) throw new Error("Ticket not found");
  return ticket;
}

export async function assignTicket(ticketId: string, assignedUserId: string) {
  const adminId = await checkSuperAdmin();

  const ticket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { assignedUserId }
  });

  await logAdminAction(adminId, "ASSIGN_TICKET", { ticketId, assignedUserId, workspaceId: ticket.workspaceId });
  
  await dispatchNotification({
    userId: assignedUserId,
    workspaceId: ticket.workspaceId, // Platform alert essentially
    type: NotificationTypes.SYSTEM_ALERT,
    title: "Support Ticket Assigned",
    message: `You have been assigned to support ticket: ${ticket.subject}.`,
    actionUrl: `/admin/support/${ticket.id}`
  });

  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath(`/admin/support`);
  return { success: true };
}

export async function updateTicketStatus(ticketId: string, status: any) {
  const adminId = await checkSuperAdmin();
  const parsed = updateTicketStatusSchema.parse({ status });

  const ticket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { 
      status: parsed.status,
      resolvedAt: (parsed.status === "RESOLVED" || parsed.status === "CLOSED") ? new Date() : null
    },
    include: { workspace: { select: { members: { where: { role: "OWNER" }, select: { userId: true } } } } }
  });

  await logAdminAction(adminId, "UPDATE_TICKET_STATUS", { ticketId, status: parsed.status, workspaceId: ticket.workspaceId });

  // Notify workspace owner
  const ownerId = ticket.workspace.members[0]?.userId;
  if (ownerId) {
    await dispatchNotification({
      userId: ownerId,
      workspaceId: ticket.workspaceId,
      type: NotificationTypes.SYSTEM_ALERT,
      title: "Support Ticket Updated",
      message: `Your ticket "${ticket.subject}" has been marked as ${parsed.status}.`,
      actionUrl: `/support/${ticket.id}`
    });
  }

  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath(`/admin/support`);
  return { success: true };
}

export async function updateTicketPriority(ticketId: string, priority: any) {
  const adminId = await checkSuperAdmin();
  const parsed = updateTicketPrioritySchema.parse({ priority });

  const ticket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { priority: parsed.priority }
  });

  await logAdminAction(adminId, "UPDATE_TICKET_PRIORITY", { ticketId, priority: parsed.priority, workspaceId: ticket.workspaceId });
  
  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath(`/admin/support`);
  return { success: true };
}

export async function adminReplyToTicket(ticketId: string, data: any) {
  const adminId = await checkSuperAdmin();
  const parsed = addReplySchema.parse(data);

  const ticket = await prisma.ticket.findUnique({ 
    where: { id: ticketId },
    include: { workspace: { select: { members: { where: { role: "OWNER" }, select: { userId: true } } } } }
  });
  if (!ticket) throw new Error("Ticket not found");

  await prisma.ticketReply.create({
    data: {
      ticketId: ticket.id,
      authorUserId: adminId,
      messageBody: parsed.messageBody,
      isInternalNote: parsed.isInternalNote
    }
  });

  if (!parsed.isInternalNote) {
    // Notify owner
    const ownerId = ticket.workspace.members[0]?.userId;
    if (ownerId) {
      await dispatchNotification({
        userId: ownerId,
        workspaceId: ticket.workspaceId,
        type: NotificationTypes.SYSTEM_ALERT,
        title: "New Reply on Support Ticket",
        message: `An administrator has replied to your ticket "${ticket.subject}".`,
        actionUrl: `/support/${ticket.id}`
      });
    }
  }

  await logAdminAction(adminId, "REPLY_TICKET", { ticketId, isInternalNote: parsed.isInternalNote, workspaceId: ticket.workspaceId });
  
  revalidatePath(`/admin/support/${ticketId}`);
  return { success: true };
}
