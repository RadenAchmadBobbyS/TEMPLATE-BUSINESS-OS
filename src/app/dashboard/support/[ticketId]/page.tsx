import { getTicket } from '@/core/support/actions';
import { format } from 'date-fns';
import { Badge } from '@/shared/ui/badge';
import { ReplyForm } from '@/core/support/components/ReplyForm';
import Link from 'next/link';
import { ArrowLeft, User, ShieldAlert } from 'lucide-react';
import { CornerMarks } from '@/shared/ui/blueprint';
import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';

export default async function TicketDetailsPage({ params }: { params: { ticketId: string } }) {
  const ticket = await getTicket(params.ticketId);

  return (
    <StaggerContainer
      className="mx-auto max-w-4xl space-y-6"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <StaggerItem>
        <Link
          href="/dashboard/support"
          className="font-data flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase transition-colors hover:opacity-100"
          style={{ color: 'var(--slate)' }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Tickets
        </Link>
      </StaggerItem>

      <StaggerItem
        className="relative rounded-none border-2 p-6"
        style={{
          borderColor: 'var(--ink)',
          boxShadow: '4px 4px 0px var(--ink)',
          backgroundColor: 'var(--paper)',
        }}
      >
        <CornerMarks />
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--ink)' }}>
              {ticket.subject}
            </h1>
            <div
              className="font-data mt-2 flex items-center gap-3 text-[10px] font-bold tracking-wider uppercase"
              style={{ color: 'var(--slate)' }}
            >
              <span>Ticket #{ticket.id.split('-')[0]}</span>
              <span>•</span>
              <span>{format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="font-data rounded-none border-[var(--ink)] text-[10px] font-bold tracking-wider uppercase"
            >
              {ticket.category}
            </Badge>
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
            <Badge
              variant={ticket.status === 'CLOSED' ? 'secondary' : 'default'}
              className={`font-data rounded-none border-[var(--ink)] text-[10px] font-bold tracking-wider uppercase ${ticket.status === 'RESOLVED' ? 'bg-[var(--signal)] text-white' : ''}`}
            >
              {ticket.status}
            </Badge>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem className="space-y-4">
        {ticket.replies.map((reply) => {
          const isStaff = reply.authorUser?.isSuperAdmin;
          return (
            <div
              key={reply.id}
              className={`relative flex gap-4 rounded-none p-4 shadow-[2px_2px_0px_var(--ink)] ${
                isStaff ? 'border-2 border-[var(--signal)] bg-[rgba(36,81,255,0.05)]' : 'border-2'
              }`}
              style={
                !isStaff
                  ? { borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }
                  : undefined
              }
            >
              {isStaff && <CornerMarks />}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border"
                style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--line)' }}
              >
                {isStaff ? (
                  <ShieldAlert className="h-5 w-5" style={{ color: 'var(--signal)' }} />
                ) : (
                  <User className="h-5 w-5" style={{ color: 'var(--slate)' }} />
                )}
              </div>
              <div className="z-10 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div
                    className="font-display flex items-center gap-2 text-sm font-bold"
                    style={{ color: 'var(--ink)' }}
                  >
                    {reply.authorUser?.name || 'System'}
                    {isStaff && (
                      <Badge className="font-data h-4 rounded-none bg-[var(--signal)] text-[10px] font-bold tracking-wider text-white uppercase">
                        STAFF
                      </Badge>
                    )}
                  </div>
                  <span
                    className="font-data text-[10px] font-bold tracking-wider uppercase"
                    style={{ color: 'var(--slate)' }}
                  >
                    {format(new Date(reply.createdAt), 'MMM d, h:mm a')}
                  </span>
                </div>
                <div className="pt-2 text-sm whitespace-pre-wrap" style={{ color: 'var(--ink)' }}>
                  {reply.messageBody}
                </div>
              </div>
            </div>
          );
        })}
      </StaggerItem>

      {ticket.status !== 'CLOSED' && (
        <StaggerItem className="mt-8">
          <ReplyForm ticketId={ticket.id} />
        </StaggerItem>
      )}

      {ticket.status === 'CLOSED' && (
        <StaggerItem
          className="font-data mt-8 rounded-none border-2 p-6 text-center text-[10px] font-bold tracking-wider uppercase"
          style={{
            borderColor: 'var(--ink)',
            boxShadow: '2px 2px 0px var(--ink)',
            backgroundColor: 'var(--line)',
            color: 'var(--slate)',
          }}
        >
          This ticket has been closed. Please open a new ticket if you need further assistance.
        </StaggerItem>
      )}
    </StaggerContainer>
  );
}
