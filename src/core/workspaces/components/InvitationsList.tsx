'use client';

import { useState } from 'react';
import { acceptInvitation, rejectInvitation } from '@/core/workspaces/actions';
import { useToast } from '@/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Loader2, Check, X, Mail } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { CornerMarks } from '@/shared/ui/blueprint';

export function InvitationsList({ invitations }: { invitations: any[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (token: string, id: string) => {
    setProcessingId(id);
    try {
      const res = await acceptInvitation(token);
      if (res && 'success' in res && !res.success) {
        toast({ title: 'Error', description: res.error, variant: 'destructive' });
      } else {
        toast({ title: 'Invitation accepted!' });
        router.refresh();
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to accept', variant: 'destructive' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (token: string, id: string) => {
    setProcessingId(id);
    try {
      const res = await rejectInvitation(token);
      if (res && 'success' in res && !res.success) {
        toast({ title: 'Error', description: res.error, variant: 'destructive' });
      } else {
        toast({ title: 'Invitation rejected' });
        router.refresh();
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to reject', variant: 'destructive' });
    } finally {
      setProcessingId(null);
    }
  };

  if (invitations.length === 0) {
    return (
      <div
        className="relative flex flex-col items-center border-2 p-10 text-center"
        style={{
          borderColor: 'var(--ink)',
          boxShadow: '4px 4px 0px var(--ink)',
          backgroundColor: 'var(--paper)',
        }}
      >
        <CornerMarks />
        <Mail className="mb-3 h-8 w-8 opacity-30" style={{ color: 'var(--ink)' }} />
        <p className="font-display font-semibold" style={{ color: 'var(--ink)' }}>
          No pending invitations
        </p>
        <p className="mt-1 text-sm" style={{ color: 'var(--slate)' }}>
          You&apos;ll see workspace invites here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {invitations.map((inv) => (
        <div
          key={inv.id}
          className="relative flex flex-col justify-between border-2 p-5"
          style={{
            borderColor: 'var(--ink)',
            boxShadow: '4px 4px 0px var(--ink)',
            backgroundColor: 'var(--paper)',
          }}
        >
          <CornerMarks />
          <div className="mb-4">
            <h3
              className="font-display font-semibold tracking-tight"
              style={{ color: 'var(--ink)' }}
            >
              {inv.workspace.name}
            </h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--slate)' }}>
              Invited you as{' '}
              <Badge
                className="font-data ml-1 rounded-none border-2"
                style={{
                  borderColor: 'var(--ink)',
                  backgroundColor: 'var(--line)',
                  color: 'var(--ink)',
                }}
              >
                {inv.role}
              </Badge>
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1 rounded-none border-2"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--signal)', color: '#fff' }}
              onClick={() => handleAccept(inv.token, inv.id)}
              disabled={processingId !== null}
            >
              {processingId === inv.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Accept
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive/10 flex-1 rounded-none border-2"
              style={{ borderColor: 'var(--ink)' }}
              onClick={() => handleReject(inv.token, inv.id)}
              disabled={processingId !== null}
            >
              {processingId === inv.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" /> Reject
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
