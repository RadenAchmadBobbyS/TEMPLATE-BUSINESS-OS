import { getMyTickets } from '@/core/support/actions';
import Link from 'next/link';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { CornerMarks, PageHeader, btnPrimary } from '@/shared/ui/blueprint';
import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';

export default async function SupportPage() {
  const tickets = await getMyTickets();

  return (
    <StaggerContainer
      className="mx-auto max-w-7xl space-y-8"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
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
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center"
                    style={{ color: 'var(--slate)', fontFamily: 'Inter, sans-serif' }}
                  >
                    No support tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="transition-colors hover:bg-[var(--line)]">
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
