"use client";

import { useState } from "react";
import { addTicketMessage } from "@/core/support/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Loader2 } from "lucide-react";

export function ReplyForm({ ticketId }: { ticketId: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      await addTicketMessage(ticketId, { messageBody: message, isInternalNote: false });
      setMessage("");
      toast({ title: "Reply sent" });
    } catch (error: any) {
      toast({ title: "Failed to send reply", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea 
        placeholder="Type your reply here..." 
        className="min-h-[100px] rounded-none border-2 border-[var(--ink)] bg-[var(--paper)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[var(--signal)] shadow-[2px_2px_0px_var(--ink)]"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !message.trim()} className="rounded-none border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Reply
        </Button>
      </div>
    </form>
  );
}
