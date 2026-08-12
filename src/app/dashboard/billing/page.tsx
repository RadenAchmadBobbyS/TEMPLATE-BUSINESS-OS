import { getSubscriptionData } from '@/core/billing/actions';
import { BillingDashboard } from '@/core/billing/components/BillingDashboard';
import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';
import { getActiveWorkspace } from '@/core/workspaces/server-context';
import { Button } from '@/shared/ui/button';
import { Plus, Globe } from 'lucide-react';
import Link from 'next/link';
import { CornerMarks, PageHeader, btnPrimary } from '@/shared/ui/blueprint';

export default async function BillingPage() {
  const active = await getActiveWorkspace();

  if (!active) {
    return (
      <div className="mx-auto mt-20 flex max-w-md flex-col items-center px-4 text-center">
        <div
          className="relative w-full border-2 p-10"
          style={{
            borderColor: 'var(--ink)',
            boxShadow: '6px 6px 0px var(--ink)',
            backgroundColor: 'var(--paper)',
          }}
        >
          <CornerMarks />
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border-2"
            style={{ borderColor: 'var(--ink)' }}
          >
            <Globe className="h-5 w-5" style={{ color: 'var(--signal)' }} />
          </div>
          <h2
            className="font-display text-2xl font-semibold tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            No Workspace Found
          </h2>
          <p className="mt-3 text-sm" style={{ color: 'var(--slate)' }}>
            You need to create a workspace before you can manage billing and subscriptions.
          </p>
          <Button
            asChild
            className={`${btnPrimary} mt-6`}
            style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
          >
            <Link href="/dashboard/workspaces/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const subscription = await getSubscriptionData();

  return (
    <StaggerContainer
      className="mx-auto max-w-7xl space-y-8"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <StaggerItem>
        <PageHeader
          eyebrow="ACCOUNT"
          title="Billing & Plans"
          description="Manage your workspace subscription, view usage, and download invoices."
        />
      </StaggerItem>

      <StaggerItem>
        <BillingDashboard subscription={subscription} />
      </StaggerItem>
    </StaggerContainer>
  );
}
