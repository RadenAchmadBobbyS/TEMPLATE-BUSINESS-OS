import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { auth } from '@/core/auth/auth';
import { headers, cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, isSuperAdmin: true },
    });

    if (!admin?.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Super Admin access required' },
        { status: 403 },
      );
    }

    const resolvedParams = await params;
    const targetUserId = resolvedParams.userId;

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    if (targetUser.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Cannot impersonate another Super Admin' },
        { status: 403 },
      );
    }

    // Generate a secure session token (Must be UUID for Better Auth generateId: "uuid")
    const token = uuidv4();

    // Create session directly in database to bypass API limitations
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.session.create({
      data: {
        userId: targetUserId,
        token,
        expiresAt,
        impersonatedBy: admin.id,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'Impersonation Worker',
      },
    });

    // Log the audit event
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'IMPERSONATE_START',
        metadata: {
          targetUserId,
          targetUserEmail: targetUser.email,
        },
      },
    });

    const response = NextResponse.json({ impersonation_token: token });

    // Read the current admin token
    const cookieStore = await cookies();
    const originalToken = cookieStore.get('better-auth.session_token')?.value;

    if (originalToken) {
      response.cookies.set('admin_original_session', originalToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hour
      });
    }

    // Set cookie using the standard better-auth cookie name
    response.cookies.set('better-auth.session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error: any) {
    console.error('Impersonation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
