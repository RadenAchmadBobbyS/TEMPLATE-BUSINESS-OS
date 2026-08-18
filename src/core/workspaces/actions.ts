'use server';

import { prisma } from '@/shared/lib/prisma';
import { auth } from '@/core/auth/auth';
import { headers, cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createWorkspaceSchema, updateWorkspaceSchema, inviteMemberSchema } from './schemas';
import { requireActiveWorkspace, requireActiveWorkspaceAction, checkWorkspacePermission, hasWorkspacePermission } from './server-context';
import { dispatchNotification } from '@/core/notifications/dispatcher';
import { NotificationTypes } from '@/core/notifications/types';
import { sendTransactionalEmail } from '@/core/notifications/email';
import { z } from 'zod';
import { render } from '@react-email/components';
import { WorkspaceInvitationEmail } from '@/core/notifications/emails/WorkspaceInvitationEmail';

async function getUniqueSlug(baseName: string) {
  const slug =
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'workspace';
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
  if (!session) throw new Error('Unauthorized');

  const roles = await prisma.userRole.findMany({
    where: {
      userId: session.user.id,
      workspace: { isArchived: false, deletedAt: null },
    },
    include: { workspace: true },
    orderBy: { workspace: { createdAt: 'asc' } },
  });

  return roles.map((r) => ({
    id: r.workspace.id,
    name: r.workspace.name,
    role: r.role,
  }));
}

export async function getAllUserWorkspaces() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');

  const roles = await prisma.userRole.findMany({
    where: {
      userId: session.user.id,
    },
    include: { workspace: true },
    orderBy: { workspace: { createdAt: 'asc' } },
  });

  return roles.map((r) => ({
    id: r.workspace.id,
    name: r.workspace.name,
    role: r.role,
    isArchived: r.workspace.isArchived,
  }));
}

export async function canCreateWorkspace() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { allowed: false, message: 'Unauthorized' };

  const userWithSub = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true }
  });
  
  if (!userWithSub) return { allowed: false, message: 'User not found' };
  
  const tier = userWithSub.subscription?.planTier || 'FREE';
  const limits = (await import('@/core/billing/plans.config')).PLAN_LIMITS[tier];
  
  const ownedCount = await prisma.userRole.count({
    where: {
      userId: session.user.id,
      role: 'OWNER',
      workspace: { deletedAt: null, isArchived: false }
    }
  });

  if (ownedCount >= limits.maxWorkspaces) {
    return { 
      allowed: false, 
      message: `You have reached the maximum number of workspaces (${limits.maxWorkspaces}) for your ${tier} plan. Please upgrade your subscription to create more.`
    };
  }

  return { allowed: true };
}

export async function createWorkspace(data: any) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };
  const parsedData = createWorkspaceSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, error: parsedData.error.issues[0].message };
  }
  const parsed = parsedData.data;
  const slug = await getUniqueSlug(parsed.name);

  const quota = await canCreateWorkspace();
  if (!quota.allowed) {
    return { success: false, error: quota.message };
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: parsed.name,
      slug,
      members: {
        create: {
          userId: session.user.id,
          role: 'OWNER',
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
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;
  if (!hasWorkspacePermission(role, 'ADMIN')) {
    return { success: false, error: 'Unauthorized.' };
  }

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

  revalidatePath('/');
  return { success: true, workspace: updated };
}

export async function archiveWorkspace() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;
  if (!hasWorkspacePermission(role, 'OWNER')) {
    return { success: false, error: 'Unauthorized.' };
  }

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { isArchived: true, deletedAt: new Date() },
  });

  const cookieStore = await cookies();
  cookieStore.delete('workspace_id');

  revalidatePath('/');
  return { success: true };
}

export async function restoreWorkspace(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  // Need to find if user is OWNER, but workspace might be archived so requireActiveWorkspace won't work
  const userRole = await prisma.userRole.findUnique({
    where: { userId_workspaceId: { userId: session.user.id, workspaceId: id } },
    include: { workspace: true },
  });
  if (!userRole || userRole.role !== 'OWNER') return { success: false, error: 'Unauthorized or not owner' };

  await prisma.workspace.update({
    where: { id },
    data: { isArchived: false, deletedAt: null },
  });

  revalidatePath('/');
  return { success: true };
}

export async function deleteWorkspace(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  const userRole = await prisma.userRole.findUnique({
    where: { userId_workspaceId: { userId: session.user.id, workspaceId: id } },
  });
  if (!userRole || userRole.role !== 'OWNER') return { success: false, error: 'Unauthorized or not owner' };

  await prisma.workspace.delete({
    where: { id },
  });

  const cookieStore = await cookies();
  if (cookieStore.get('workspace_id')?.value === id) {
    cookieStore.delete('workspace_id');
  }

  revalidatePath('/');
  return { success: true };
}

export async function setActiveWorkspace(workspaceId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  // Verify access
  const role = await prisma.userRole.findUnique({
    where: { userId_workspaceId: { userId: session.user.id, workspaceId } },
    include: { workspace: true },
  });

  if (!role || role.workspace.deletedAt || role.workspace.isArchived) {
    return { success: false, error: 'Workspace not found or access denied' };
  }

  const cookieStore = await cookies();
  cookieStore.set('workspace_id', workspaceId, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  revalidatePath('/', 'layout');

  return { success: true, workspaceId };
}

export async function getWorkspaceMembers() {
  const active = await requireActiveWorkspaceAction();
  if (!active.success) throw new Error(active.error);
  const { workspace, role } = active;
  if (!hasWorkspacePermission(role, 'EDITOR')) {
    return [];
  }

  const members = await prisma.userRole.findMany({
    where: { workspaceId: workspace.id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { user: { name: 'asc' } },
  });

  return members;
}

export async function inviteMember(data: any) {
  try {
    const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;
    if (role !== 'ADMIN' && role !== 'OWNER') {
      return { success: false, error: 'Unauthorized. Only ADMIN and OWNER can invite members.' };
    }

    const parsedData = inviteMemberSchema.safeParse(data);
    if (!parsedData.success) {
      return { 
        success: false, 
        error: 'Invalid input', 
        fieldErrors: parsedData.error.flatten().fieldErrors 
      };
    }
    const parsed = parsedData.data;

    // Check if user is already in workspace
    const existingUser = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existingUser) {
      const existingRole = await prisma.userRole.findUnique({
        where: { userId_workspaceId: { userId: existingUser.id, workspaceId: workspace.id } },
      });
      if (existingRole) return { success: false, error: 'User is already a member of this workspace.' };
    }

    // Check if invitation already exists and is pending
    const existingInvite = await prisma.workspaceInvitation.findUnique({
      where: { workspaceId_email: { workspaceId: workspace.id, email: parsed.email } },
    });

    if (
      existingInvite &&
      existingInvite.status === 'PENDING' &&
      existingInvite.expiresAt > new Date()
    ) {
      return { success: false, error: 'An invitation is already pending for this email.' };
    }

    const token = globalThis.crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    if (existingInvite) {
      await prisma.workspaceInvitation.update({
        where: { id: existingInvite.id },
        data: { token, expiresAt, status: 'PENDING', role: parsed.role, canCreateDelete: parsed.canCreateDelete },
      });
    } else {
      await prisma.workspaceInvitation.create({
        data: {
          workspaceId: workspace.id,
          email: parsed.email,
          role: parsed.role as any,
          canCreateDelete: parsed.canCreateDelete,
          token,
          expiresAt,
        },
      });
    }

    const headerList = await headers();
    const host = headerList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const inviteUrl = `${protocol}://${host}/dashboard/invitations`;

    const emailHtml = await render(
      WorkspaceInvitationEmail({
        workspaceName: workspace.name,
        role: parsed.role,
        inviteUrl: inviteUrl,
      })
    );

    await sendTransactionalEmail({
      to: parsed.email,
      subject: `You have been invited to join ${workspace.name}`,
      html: emailHtml,
    });

    revalidatePath(`/dashboard/settings/workspace`);
    revalidatePath(`/dashboard/team`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function getWorkspaceInvitations() {
  const active = await requireActiveWorkspaceAction();
  if (!active.success) throw new Error(active.error);
  const { workspace, role } = active;
  if (!hasWorkspacePermission(role, 'ADMIN')) {
    return [];
  }

  return prisma.workspaceInvitation.findMany({
    where: { workspaceId: workspace.id, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });
}

export async function resendInvitation(id: string) {
  try {
    const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;
    if (role !== 'ADMIN' && role !== 'OWNER') {
      return { success: false, error: 'Unauthorized.' };
    }

    const existingInvite = await prisma.workspaceInvitation.findUnique({
      where: { id, workspaceId: workspace.id },
    });

    if (!existingInvite || existingInvite.status !== 'PENDING') {
      return { success: false, error: 'Pending invitation not found.' };
    }

    const headerList = await headers();
    const host = headerList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const inviteUrl = `${protocol}://${host}/dashboard/invitations`;

    const emailHtml = await render(
      WorkspaceInvitationEmail({
        workspaceName: workspace.name,
        role: existingInvite.role,
        inviteUrl: inviteUrl,
      })
    );

    await sendTransactionalEmail({
      to: existingInvite.email,
      subject: `Reminder: You have been invited to join ${workspace.name}`,
      html: emailHtml,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to resend invitation.' };
  }
}

export async function revokeInvitation(id: string) {
  try {
    const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;
    if (role !== 'ADMIN' && role !== 'OWNER') {
      return { success: false, error: 'Unauthorized.' };
    }

    await prisma.workspaceInvitation.delete({
      where: { id, workspaceId: workspace.id },
    });

    revalidatePath(`/dashboard/settings/workspace`);
    revalidatePath(`/dashboard/team`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to revoke invitation.' };
  }
}

export async function getPendingInvitations() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error('Unauthorized');

    return prisma.workspaceInvitation.findMany({
      where: { email: session.user.email, status: 'PENDING' },
      include: { workspace: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    return [];
  }
}

export async function acceptInvitation(token: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: 'Unauthorized' };

    const invite = await prisma.workspaceInvitation.findUnique({
      where: { token },
    });

    if (!invite || invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
      return { success: false, error: 'Invalid or expired invitation' };
    }

    if (invite.email !== session.user.email) {
      return { success: false, error: 'This invitation was sent to a different email address' };
    }

    await prisma.$transaction([
      prisma.userRole.upsert({
        where: { userId_workspaceId: { userId: session.user.id, workspaceId: invite.workspaceId } },
        update: { role: invite.role as any },
        create: { userId: session.user.id, workspaceId: invite.workspaceId, role: invite.role as any },
      }),
      prisma.workspaceInvitation.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' },
      }),
    ]);

    revalidatePath('/');
    return { success: true, workspaceId: invite.workspaceId };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred' };
  }
}

export async function rejectInvitation(token: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: 'Unauthorized' };

    const invite = await prisma.workspaceInvitation.findUnique({
      where: { token },
    });

    if (!invite || invite.status !== 'PENDING') {
      return { success: false, error: 'Invalid invitation' };
    }

    if (invite.email !== session.user.email) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.workspaceInvitation.update({
      where: { id: invite.id },
      data: { status: 'REJECTED' },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred' };
  }
}

export async function updateMemberRole(userId: string, newRole: 'ADMIN' | 'EDITOR', canCreateDelete?: boolean) {
  try {
    const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role: currentUserRole } = active;
    if (currentUserRole !== 'ADMIN' && currentUserRole !== 'OWNER') {
      return { success: false, error: 'Unauthorized.' };
    }

    const targetRole = await prisma.userRole.findUnique({
      where: { userId_workspaceId: { userId, workspaceId: workspace.id } },
    });

    if (!targetRole) return { success: false, error: 'Member not found' };
    if (targetRole.role === 'OWNER') return { success: false, error: 'Cannot change OWNER role' };

    await prisma.userRole.update({
      where: { userId_workspaceId: { userId, workspaceId: workspace.id } },
      data: { 
        role: newRole as any,
        ...(canCreateDelete !== undefined && { canCreateDelete })
      },
    });

    await dispatchNotification({
      userId,
      workspaceId: workspace.id,
      type: NotificationTypes.WORKSPACE_ROLE_CHANGED,
      title: 'Workspace Role Updated',
      message: `Your role in the workspace "${workspace.name}" has been updated to ${newRole}.`,
      actionUrl: '/dashboard',
    });

    revalidatePath(`/dashboard/settings/workspace`);
    revalidatePath(`/dashboard/team`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update member role.' };
  }
}

export async function removeMember(userId: string) {
  try {
    const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role: currentUserRole } = active;
    if (currentUserRole !== 'ADMIN' && currentUserRole !== 'OWNER') {
      return { success: false, error: 'Unauthorized.' };
    }

    const targetRole = await prisma.userRole.findUnique({
      where: { userId_workspaceId: { userId, workspaceId: workspace.id } },
    });

    if (!targetRole) return { success: false, error: 'Member not found' };
    if (targetRole.role === 'OWNER') return { success: false, error: 'Cannot remove OWNER from workspace' };

    await prisma.userRole.delete({
      where: { userId_workspaceId: { userId, workspaceId: workspace.id } },
    });

    revalidatePath(`/dashboard/settings/workspace`);
    revalidatePath(`/dashboard/team`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to remove member.' };
  }
}
