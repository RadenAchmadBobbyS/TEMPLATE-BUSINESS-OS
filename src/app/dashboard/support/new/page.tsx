'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTicket } from '@/core/support/actions';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CornerMarks, PageHeader, btnPrimary, btnOutline } from '@/shared/ui/blueprint';
import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';

const labelClass = 'font-data text-sm font-semibold uppercase tracking-wider';
const labelStyle = { color: 'var(--slate)' };

export default function NewTicketPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const ticket = await createTicket({
        subject: formData.get('subject'),
        category: formData.get('category'),
        priority: formData.get('priority'),
        message: formData.get('message'),
      });
      toast({ title: 'Ticket created successfully!' });
      router.push(`/support/${ticket.id}`);
    } catch (error: any) {
      toast({
        title: 'Failed to create ticket',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <StaggerContainer
        className="relative space-y-8 border-2 p-8"
        style={{
          borderColor: 'var(--ink)',
          boxShadow: '4px 4px 0px var(--ink)',
          backgroundColor: 'var(--paper)',
        }}
      >
        <CornerMarks />
        <StaggerItem>
          <PageHeader
            eyebrow="HELP"
            title="Create Support Ticket"
            description="Describe your issue in detail so we can help you as quickly as possible."
          />
        </StaggerItem>

        <form onSubmit={handleSubmit} className="space-y-6">
          <StaggerItem className="space-y-2">
            <label className={labelClass} style={labelStyle}>
              Subject
            </label>
            <Input
              name="subject"
              required
              placeholder="Brief summary of the issue"
              className="rounded-none border-2 border-[var(--ink)] focus-visible:ring-[var(--signal)]"
              style={{ backgroundColor: 'var(--paper)' }}
            />
          </StaggerItem>

          <StaggerItem className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass} style={labelStyle}>
                Category
              </label>
              <Select name="category" defaultValue="GENERAL">
                <SelectTrigger
                  className="rounded-none border-2 border-[var(--ink)]"
                  style={{ backgroundColor: 'var(--paper)' }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="rounded-none border-2"
                  style={{ borderColor: 'var(--ink)', boxShadow: '4px 4px 0px var(--ink)' }}
                >
                  <SelectItem value="GENERAL">General Inquiry</SelectItem>
                  <SelectItem value="BUG_REPORT">Bug Report</SelectItem>
                  <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
                  <SelectItem value="BILLING">Billing Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className={labelClass} style={labelStyle}>
                Priority
              </label>
              <Select name="priority" defaultValue="MEDIUM">
                <SelectTrigger
                  className="rounded-none border-2 border-[var(--ink)]"
                  style={{ backgroundColor: 'var(--paper)' }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="rounded-none border-2"
                  style={{ borderColor: 'var(--ink)', boxShadow: '4px 4px 0px var(--ink)' }}
                >
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent (Platform Down)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </StaggerItem>

          <StaggerItem className="space-y-2">
            <label className={labelClass} style={labelStyle}>
              Message
            </label>
            <Textarea
              name="message"
              required
              placeholder="Please provide all relevant details..."
              className="min-h-[150px] rounded-none border-2 border-[var(--ink)] focus-visible:ring-[var(--signal)]"
              style={{ backgroundColor: 'var(--paper)' }}
            />
          </StaggerItem>

          <StaggerItem className="flex justify-end gap-4">
            <Link href="/dashboard/support">
              <Button variant="outline" type="button" disabled={loading} className={btnOutline}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className={btnPrimary}
              style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Ticket
            </Button>
          </StaggerItem>
        </form>
      </StaggerContainer>
    </div>
  );
}
