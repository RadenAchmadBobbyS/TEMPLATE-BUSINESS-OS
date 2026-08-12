import { getAdminTickets } from "@/core/support/actions";
import Link from "next/link";
import { format } from "date-fns";
import { LifeBuoy } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

export default async function AdminSupportPage() {
  const tickets = await getAdminTickets();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <LifeBuoy className="h-6 w-6" /> Support Tickets
        </h2>
        <p className="text-muted-foreground mt-1">Manage global platform support tickets and user inquiries.</p>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket</th>
                <th className="px-6 py-4 font-medium">Workspace</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Assigned To</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{ticket.subject}</div>
                      <div className="text-xs text-muted-foreground mt-1">{ticket.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.workspace.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={ticket.status === "CLOSED" ? "secondary" : ticket.status === "RESOLVED" ? "default" : "outline"} className={ticket.status === "RESOLVED" ? "bg-green-500/10 text-green-600" : ""}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        ticket.priority === "URGENT" ? "border-red-500 text-red-600" : 
                        ticket.priority === "HIGH" ? "border-amber-500 text-amber-600" : ""
                      }>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {ticket.assignedUser?.name || "Unassigned"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/support/${ticket.id}`}>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
