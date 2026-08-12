import { describe, it, expect, vi } from 'vitest';
import { getSubscriptionData } from '@/core/billing/actions';
import { prisma } from '@/shared/lib/prisma';
import { auth } from '@/core/auth/auth';

// Mock dependencies
vi.mock('@/shared/lib/prisma', () => ({
  prisma: {
    userRole: { findFirst: vi.fn() },
    subscription: {
      findUnique: vi.fn(),
      create: vi.fn()
    }
  }
}));

vi.mock('@/core/auth/auth', () => ({
  auth: {
    api: { getSession: vi.fn() }
  }
}));

describe('Billing Actions Integration', () => {
  it('should initialize a FREE subscription if none exists', async () => {
    // Setup mocks
    (auth.api.getSession as any).mockResolvedValue({ user: { id: 'user-1' } });
    (prisma.userRole.findFirst as any).mockResolvedValue({ role: 'OWNER', workspaceId: 'ws-1' });
    (prisma.subscription.findUnique as any).mockResolvedValue(null);
    (prisma.subscription.create as any).mockResolvedValue({
      id: 'sub-1',
      planTier: 'FREE',
      status: 'ACTIVE'
    });

    // Execute
    const result = await getSubscriptionData();

    // Assert
    expect(result.planTier).toBe('FREE');
    expect(prisma.subscription.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ planTier: 'FREE' })
    }));
  });
});
