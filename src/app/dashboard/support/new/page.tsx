'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTicket } from '@/core/support/actions';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import {
  Loader2,
  Bug,
  Sparkles as SparklesIcon,
  CreditCard,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { CornerMarks, PageHeader, btnPrimary, btnOutline } from '@/shared/ui/blueprint';
import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';

const labelClass = 'font-data text-sm font-semibold uppercase tracking-wider';
const labelStyle = { color: 'var(--slate)' };

const priorities = [
  { value: 'LOW', label: 'Low', desc: 'Bisa ditunggu, tidak mendesak' },
  { value: 'MEDIUM', label: 'Medium', desc: 'Mengganggu tapi ada workaround' },
  { value: 'HIGH', label: 'High', desc: 'Mengganggu pekerjaan tim' },
  { value: 'URGENT', label: 'Urgent', desc: 'Platform down / tidak bisa dipakai' },
];

export default function NewTicketPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState('MEDIUM');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const ticket = await createTicket({
        subject: formData.get('subject'),
        category: formData.get('category'),
        priority,
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
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      {/* Left: helper panel, floats outside the form box */}
      <StaggerContainer className="hidden flex-col gap-4 lg:flex">
        <StaggerItem>
          <div
            className="font-data mb-2 flex items-center gap-2 text-xs"
            style={{ color: 'var(--signal)' }}
          >
            <span className="h-1.5 w-1.5" style={{ backgroundColor: 'var(--amber)' }} />
            SEBELUM MENGIRIM
          </div>
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            Tiket yang jelas dibalas lebih cepat. Beberapa tips singkat:
          </p>
        </StaggerItem>

        {[
          { icon: HelpCircle, text: 'Jelaskan apa yang terjadi vs yang diharapkan' },
          { icon: Bug, text: 'Sertakan langkah untuk mereproduksi masalah' },
          { icon: Clock, text: 'Rata-rata respons: 2–6 jam kerja' },
          { icon: ShieldCheck, text: 'Tiket URGENT diprioritaskan tim on-call' },
        ].map((tip) => (
          <StaggerItem
            key={tip.text}
            className="flex items-start gap-3 border-2 p-3"
            style={{
              borderColor: 'var(--ink)',
              boxShadow: '2px 2px 0px var(--ink)',
              backgroundColor: 'var(--paper)',
            }}
          >
            <tip.icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--signal)' }} />
            <span className="text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>
              {tip.text}
            </span>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Right: form */}
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

          <StaggerItem className="space-y-2">
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
          </StaggerItem>

          {/* Priority as visual chips instead of a plain dropdown */}
          <StaggerItem className="space-y-2">
            <label className={labelClass} style={labelStyle}>
              Priority
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {priorities.map((p) => {
                const active = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className="border-2 p-3 text-left transition-all"
                    style={{
                      borderColor: active ? 'var(--signal)' : 'var(--ink)',
                      backgroundColor: active ? 'rgba(36,81,255,0.06)' : 'var(--paper)',
                      boxShadow: active ? '2px 2px 0px var(--signal)' : '2px 2px 0px var(--ink)',
                    }}
                  >
                    <div
                      className="font-data text-[10px] font-bold tracking-wider uppercase"
                      style={{ color: active ? 'var(--signal)' : 'var(--ink)' }}
                    >
                      {p.label}
                    </div>
                    <div
                      className="mt-1 text-[11px] leading-snug"
                      style={{ color: 'var(--slate)' }}
                    >
                      {p.desc}
                    </div>
                  </button>
                );
              })}
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
