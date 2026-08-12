import { getPendingInvitations } from '@/core/workspaces/actions';
import { InvitationsList } from '@/core/workspaces/components/InvitationsList';
import { PageHeader } from '@/shared/ui/blueprint';

export const metadata = {
  title: 'Invitations | BusinessOS',
};

export default async function InvitationsPage() {
  const invitations = await getPendingInvitations();

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <PageHeader
          eyebrow="ACCOUNT"
          title="Invitations"
          description="Review and manage your pending workspace invitations."
        />
      </div>

      <InvitationsList invitations={invitations} />
    </div>
  );
}
