import { getAdminTicket } from "@/core/support/actions";
import { format } from "date-fns";
import { Badge } from "@/shared/ui/badge";
import { AdminTicketActions } from "@/core/support/components/AdminTicketActions";
import Link from "next/link";
import { ArrowLeft, User, ShieldAlert, LockKeyhole } from "lucide-react";

export default async function AdminTicketDetailsPage({ params }: { params: { ticketId: string } }) {
  const ticket = await getAdminTicket(params.ticketId);

  return (
    <div className="max-w-5xl space-y-6">
      <Link href="/admin/support" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Global Tickets
      </Link>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{ticket.subject}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span>Ticket #{ticket.id.split("-")[0]}</span>
              <span>•</span>
              <span className="font-medium text-foreground">{ticket.workspace.name}</span>
              <span>•</span>
              <span>{format(new Date(ticket.createdAt), "MMM d, yyyy h:mm a")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{ticket.category}</Badge>
            <Badge variant="outline" className={
              ticket.priority === "URGENT" ? "border-red-500 text-red-600" : 
              ticket.priority === "HIGH" ? "border-amber-500 text-amber-600" : ""
            }>
              {ticket.priority}
            </Badge>
            <Badge variant={ticket.status === "CLOSED" ? "secondary" : ticket.status === "RESOLVED" ? "default" : "default"} className={ticket.status === "RESOLVED" ? "bg-green-500/10 text-green-600" : ""}>
              {ticket.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Conversation Thread</h3>
          {ticket.replies.map((reply, i) => {
            const isStaff = reply.authorUser?.isSuperAdmin;
            const isInternal = reply.isInternalNote;

            return (
              <div key={reply.id} className={`flex gap-4 p-4 rounded-lg border ${
                isInternal ? "bg-amber-500/5 border-amber-500/20" : 
                isStaff ? "bg-primary/5 border-primary/20" : "bg-card"
              }`}>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {isInternal ? <LockKeyhole className="h-4 w-4 text-amber-600" /> :
                   isStaff ? <ShieldAlert className="h-5 w-5 text-primary" /> : 
                   <User className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {reply.authorUser?.name || "System"}
                      {isStaff && !isInternal && <Badge variant="secondary" className="text-[10px] h-4 bg-primary/20 text-primary border-none">STAFF</Badge>}
                      {isInternal && <Badge variant="secondary" className="text-[10px] h-4 bg-amber-500/20 text-amber-700 border-none">INTERNAL NOTE</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{format(new Date(reply.createdAt), "MMM d, h:mm a")}</span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap pt-2">
                    {reply.messageBody}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div>
          <AdminTicketActions ticket={ticket} />
        </div>
      </div>
    </div>
  );
}
