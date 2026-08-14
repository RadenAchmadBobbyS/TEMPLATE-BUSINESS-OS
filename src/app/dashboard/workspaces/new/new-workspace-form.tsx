'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createWorkspace } from '@/core/workspaces/actions';
import { createWebsite } from '@/core/websites/actions';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useToast } from '@/shared/hooks/use-toast';
import { ShieldAlert } from 'lucide-react';
import {
  Loader2,
  Building2,
  ArrowRight,
  Sparkles,
  Globe,
  BarChart3,
  Layers,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/shared/ui/alert-dialog';

export function NewWorkspaceFormBase({ quota }: { quota: { allowed: boolean; message?: string } }) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const templateId = searchParams?.get('templateId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!quota.allowed) return;

    setIsLoading(true);
    try {
      const result = await createWorkspace({ name });
      if (result && 'error' in result) {
        throw new Error(result.error as string);
      }
      toast({ title: 'Workspace created successfully' });

      if (templateId) {
        toast({ title: 'Creating website from template...' });
        const newWebsite = await createWebsite({ name: `${name} Website`, templateId });
        if ('error' in newWebsite) {
          throw new Error(newWebsite.error);
        }
        router.push(`/dashboard/websites/${newWebsite.id}/pages`);
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setErrorModal({ open: true, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background relative -m-4 h-[calc(100vh-4rem)] w-full overflow-hidden md:-m-8">
      {/* Grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Mesh blobs */}
      <div className="pointer-events-none absolute -top-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-[var(--signal)]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-[var(--amber)]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 -bottom-40 h-80 w-80 rounded-full bg-[var(--signal)]/5 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-6 overflow-hidden px-6 py-4 lg:flex-row lg:items-center lg:gap-8 lg:px-10">
        {/* Left: pitch + floating illustration */}
        <div className="hidden w-full max-w-lg flex-col lg:flex">
          <div className="text-muted-foreground mb-3 inline-flex w-fit items-center gap-2 border border-[var(--ink)]/15 bg-[var(--paper)] px-3 py-1 font-mono text-[11px] tracking-widest uppercase">
            <span className="h-1.5 w-1.5 animate-pulse bg-[var(--signal)]" />
            Getting started
          </div>
          <h1 className="text-foreground font-[Space_Grotesk] text-3xl leading-[1.1] font-semibold tracking-tight xl:text-4xl">
            Satu workspace,
            <br />
            <span className="relative inline-block">
              tak terbatas
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M1 5.5C40 2 80 1 100 3C130 6 160 6 199 2.5"
                  stroke="var(--amber)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            kemungkinan.
          </h1>
          <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
            Kelola website, tim, dan konten dalam satu ruang kerja. Undang siapa saja, bangun
            sebanyak yang kamu mau.
          </p>

          {/* Floating illustration: stacked browser mockups */}
          <div className="relative mt-8 h-44 w-full max-w-md">
            {/* back card */}
            <div className="absolute top-4 left-8 w-52 -rotate-6 border border-[var(--ink)]/12 bg-[var(--paper)] p-2.5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.15)]">
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]/20" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-3/4 bg-[var(--ink)]/10" />
                <div className="h-1.5 w-1/2 bg-[var(--ink)]/10" />
                <div className="mt-1.5 h-8 w-full bg-[var(--signal)]/10" />
              </div>
            </div>

            {/* front card */}
            <div className="absolute top-0 left-0 w-52 rotate-3 border border-[var(--ink)]/15 bg-[var(--paper)] p-2.5 shadow-[0_16px_40px_-14px_rgba(0,0,0,0.2)]">
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--amber)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]/20" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-2/3 bg-[var(--ink)]/15" />
                <div className="h-1.5 w-1/3 bg-[var(--ink)]/10" />
                <div className="mt-1.5 h-9 w-full bg-gradient-to-br from-[var(--signal)]/15 to-[var(--amber)]/10" />
              </div>
            </div>

            {/* floating badges */}
            <div className="absolute top-1 right-0 flex items-center gap-1.5 border border-[var(--ink)]/12 bg-[var(--paper)] px-2 py-1 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.15)]">
              <Globe className="h-3 w-3 text-[var(--signal)]" strokeWidth={1.75} />
              <span className="text-foreground text-[11px] font-medium">Published</span>
            </div>
            <div className="absolute right-4 bottom-1 flex items-center gap-1.5 border border-[var(--ink)]/12 bg-[var(--paper)] px-2 py-1 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.15)]">
              <BarChart3 className="h-3 w-3 text-[var(--amber)]" strokeWidth={1.75} />
              <span className="text-foreground text-[11px] font-medium">+24% traffic</span>
            </div>
            <div className="absolute bottom-7 left-0 flex items-center gap-1.5 border border-[var(--ink)]/12 bg-[var(--paper)] px-2 py-1 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.15)]">
              <Layers className="h-3 w-3 text-[var(--signal)]" strokeWidth={1.75} />
              <span className="text-foreground text-[11px] font-medium">3 template siap pakai</span>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="relative w-full max-w-md shrink-0">
          {/* Badge floating above, breaking out of the card */}
          <div className="relative z-20 mb-[-1px] ml-6 inline-flex items-center gap-2 border border-b-0 border-[var(--ink)]/12 bg-[var(--ink)] px-3.5 py-1.5">
            <Building2 className="h-3.5 w-3.5 text-[var(--paper)]" strokeWidth={1.75} />
            <span className="font-mono text-[10px] tracking-widest text-[var(--paper)] uppercase">
              Workspace baru
            </span>
          </div>

          {/* corner ticks */}
          <span className="absolute -top-3 -left-3 h-5 w-5 border-t-2 border-l-2 border-[var(--signal)]" />
          <span className="absolute -top-3 -right-3 h-5 w-5 border-t-2 border-r-2 border-[var(--signal)]" />
          <span className="absolute -bottom-3 -left-3 h-5 w-5 border-b-2 border-l-2 border-[var(--signal)]" />
          <span className="absolute -right-3 -bottom-3 h-5 w-5 border-r-2 border-b-2 border-[var(--signal)]" />

          <div className="relative z-10 border border-[var(--ink)]/12 bg-[var(--paper)] p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] sm:p-7">
            <h2 className="text-foreground font-[Space_Grotesk] text-xl font-semibold tracking-tight">
              Beri nama workspace kamu
            </h2>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              Ini akan jadi identitas utama untuk semua website dan anggota tim di dalamnya.
            </p>

            {templateId && (
              <div className="mt-3 flex items-center gap-2 border border-[var(--amber)]/30 bg-[var(--amber)]/10 px-3 py-1.5 font-mono text-[10px] tracking-wide text-[var(--amber)] uppercase">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                Website akan otomatis dibuat dari template
              </div>
            )}

            <form id="create-workspace-form" onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-muted-foreground font-mono text-xs tracking-widest uppercase"
                >
                  Nama Workspace
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="mis. Acme Corp"
                  disabled={isLoading || !quota.allowed}
                  autoFocus
                  className="bg-background h-11 rounded-none border-[var(--ink)]/15 text-base focus-visible:ring-1 focus-visible:ring-[var(--signal)]"
                />
              </div>

              <Button
                type="submit"
                form="create-workspace-form"
                className="group h-11 w-full rounded-none font-medium transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_var(--signal)] disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
                style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
                disabled={isLoading || !name.trim() || !quota.allowed}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Membuat workspace...
                  </>
                ) : (
                  <>
                    Buat Workspace
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-muted-foreground mt-4 text-center text-xs">
              Dengan melanjutkan, kamu menyetujui{' '}
              <Link href="/terms" className="hover:text-foreground underline underline-offset-2">
                Ketentuan Layanan
              </Link>{' '}
              kami.
            </p>
          </div>

          {/* Social proof floating below, breaking out of the card */}
          <div className="relative z-20 mx-auto mt-[-1px] flex w-fit items-center gap-2 border border-t-0 border-[var(--ink)]/12 bg-[var(--paper)] px-3.5 py-1.5 shadow-[0_12px_24px_-16px_rgba(0,0,0,0.15)]">
            <div className="flex -space-x-1.5">
              <span className="h-4 w-4 rounded-full border border-[var(--paper)] bg-[var(--signal)]/70" />
              <span className="h-4 w-4 rounded-full border border-[var(--paper)] bg-[var(--amber)]/70" />
              <span className="h-4 w-4 rounded-full border border-[var(--paper)] bg-[var(--ink)]/40" />
            </div>
            <span className="text-muted-foreground text-[11px]">
              <Check className="mr-1 inline h-3 w-3 text-[var(--signal)]" strokeWidth={2.5} />
              12,000+ workspace sudah dibuat
            </span>
          </div>
        </div>
      </div>

      <AlertDialog
        open={errorModal.open}
        onOpenChange={(open) => setErrorModal((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" />
              Oops! Gagal Membuat Workspace
            </AlertDialogTitle>
            <AlertDialogDescription>{errorModal.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorModal({ open: false, message: '' })}>
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function NewWorkspaceForm({ quota }: { quota: { allowed: boolean; message?: string } }) {
  return (
    <Suspense
      fallback={
        <div className="bg-background -m-4 flex h-[calc(100vh-4rem)] items-center justify-center md:-m-8">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      }
    >
      <NewWorkspaceFormBase quota={quota} />
    </Suspense>
  );
}
