"use client";

import { useState } from "react";
import { adminReplyToTicket, updateTicketStatus, updateTicketPriority } from "@/core/support/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { Loader2 } from "lucide-react";
import { TicketStatus, TicketPriority } from "@prisma/client";

export function AdminTicketActions({ ticket }: { ticket: any }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      await adminReplyToTicket(ticket.id, { messageBody: message, isInternalNote: isInternal });
      setMessage("");
      toast({ title: isInternal ? "Internal note added" : "Reply sent to user" });
    } catch (error: any) {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(status: string) {
    try {
      await updateTicketStatus(ticket.id, status as TicketStatus);
      toast({ title: "Status updated" });
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  }

  async function handlePriorityChange(priority: string) {
    try {
      await updateTicketPriority(ticket.id, priority as TicketPriority);
      toast({ title: "Priority updated" });
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-card border rounded-lg p-6 space-y-6">
        <h3 className="font-semibold text-lg">Ticket Controls</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select defaultValue={ticket.status} onValueChange={(val: any) => handleStatusChange(val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="PENDING">Pending (Waiting for User)</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select defaultValue={ticket.priority} onValueChange={(val: any) => handlePriorityChange(val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <form onSubmit={handleReply} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Add Reply or Note</h3>
          <div className="flex items-center gap-2">
            <Switch checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
            <span className="text-sm text-muted-foreground">Internal Note (Hidden from user)</span>
          </div>
        </div>
        <Textarea 
          placeholder={isInternal ? "Type an internal note..." : "Type your reply to the user..."} 
          className={`min-h-[120px] ${isInternal ? "bg-amber-500/5 border-amber-500/20 placeholder:text-amber-500/50" : ""}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !message.trim()} variant={isInternal ? "secondary" : "default"}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isInternal ? "Add Internal Note" : "Send Reply"}
          </Button>
        </div>
      </form>
    </div>
  );
}
