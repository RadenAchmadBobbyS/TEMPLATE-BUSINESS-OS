import { getMyTickets } from '@/core/support/actions';
import Link from 'next/link';
import { format } from 'date-fns';
import { PlusCircle, Inbox, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { CornerMarks, PageHeader, btnPrimary } from '@/shared/ui/blueprint';
import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';

const priorityAccent: Record<string, string> = {
  URGENT: '#dc2626',
  HIGH: 'var(--amber)',
  MEDIUM: 'var(--signal)',
  LOW: 'var(--slate)',
};

export default async function SupportPage() {
  const tickets = await getMyTickets();

  const open = tickets.filter((t) => t.status !== 'CLOSED' && t.status !== 'RESOLVED').length;
  const resolved = tickets.filter((t) => t.status === 'RESOLVED').length;

  const stats = [
    { label: 'Total Tickets', value: tickets.length, icon: Inbox, accent: 'var(--ink)' },
    { label: 'Open', value: open, icon: Clock, accent: 'var(--amber)' },
    { label: 'Resolved', value: resolved, icon: CheckCircle2, accent: 'var(--signal)' },
  ];

  return (
    <StaggerContainer
      className="relative mx-auto max-w-7xl space-y-8"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* faint grid backdrop, contained */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <StaggerItem>
        <PageHeader
          eyebrow="HELP"
          title="Support Center"
          description="Get help with your workspace and websites."
          actions={
            <Link href="/dashboard/support/new">
              <Button
                className={btnPrimary}
                style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> New Ticket
              </Button>
            </Link>
          }
        />
      </StaggerItem>

      {/* Stat strip */}
      <StaggerItem className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative flex items-center gap-4 border-2 p-4"
            style={{
              borderColor: 'var(--ink)',
              boxShadow: '3px 3px 0px var(--ink)',
              backgroundColor: 'var(--paper)',
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center"
              style={{ backgroundColor: 'var(--line)' }}
            >
              <s.icon className="h-5 w-5" style={{ color: s.accent }} />
            </div>
            <div>
              <div className="font-display text-2xl font-bold" style={{ color: 'var(--ink)' }}>
                {s.value}
              </div>
              <div
                className="font-data text-[10px] font-bold tracking-wider uppercase"
                style={{ color: 'var(--slate)' }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </StaggerItem>

      <StaggerItem
        className="relative overflow-hidden rounded-none border-2"
        style={{
          borderColor: 'var(--ink)',
          boxShadow: '4px 4px 0px var(--ink)',
          backgroundColor: 'var(--paper)',
        }}
      >
        <CornerMarks />
        <div className="relative z-10 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead
              className="font-data border-b-2 text-[10px] font-bold tracking-wider uppercase"
              style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--line)' }}
            >
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--line)' }}>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16">
                    <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                      <div
                        className="mb-4 flex h-14 w-14 items-center justify-center border-2"
                        style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--line)' }}
                      >
                        <MessageSquare className="h-6 w-6" style={{ color: 'var(--signal)' }} />
                      </div>
                      <p className="font-display font-semibold" style={{ color: 'var(--ink)' }}>
                        Belum ada tiket
                      </p>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: 'var(--slate)', fontFamily: 'Inter, sans-serif' }}
                      >
                        Punya kendala? Tim kami siap membantu.
                      </p>
                      <Link href="/dashboard/support/new" className="mt-4">
                        <Button
                          className={btnPrimary}
                          style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Buat Tiket Pertama
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="relative transition-colors hover:bg-[var(--line)]"
                    style={{
                      borderLeft: `3px solid ${priorityAccent[ticket.priority] ?? 'var(--line)'}`,
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-display font-bold" style={{ color: 'var(--ink)' }}>
                        {ticket.subject}
                      </div>
                      <div
                        className="font-data mt-1 text-[10px] font-bold tracking-wider uppercase"
                        style={{ color: 'var(--slate)' }}
                      >
                        {ticket.category} • {ticket._count.replies} replies
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          ticket.status === 'CLOSED'
                            ? 'secondary'
                            : ticket.status === 'RESOLVED'
                              ? 'default'
                              : 'outline'
                        }
                        className={`font-data rounded-none border-[var(--ink)] text-[10px] font-bold tracking-wider uppercase ${ticket.status === 'RESOLVED' ? 'bg-[var(--signal)] text-white' : ''}`}
                      >
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={`font-data rounded-none text-[10px] font-bold tracking-wider uppercase ${
                          ticket.priority === 'URGENT'
                            ? 'border-red-600 bg-red-100 text-red-600'
                            : ticket.priority === 'HIGH'
                              ? 'border-[var(--amber)] bg-[rgba(255,176,32,0.1)] text-[var(--amber)]'
                              : 'border-[var(--ink)]'
                        }`}
                      >
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td
                      className="font-data px-6 py-4 text-[10px] font-bold tracking-wider uppercase"
                      style={{ color: 'var(--slate)' }}
                    >
                      {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/support/${ticket.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-none border transition-colors hover:bg-[var(--ink)] hover:text-white"
                          style={{ borderColor: 'var(--ink)' }}
                        >
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}
