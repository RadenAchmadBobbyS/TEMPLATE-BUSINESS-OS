'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function CornerMarks({ className = '' }: { className?: string }) {
  const mark = 'absolute h-3 w-3 border-[var(--signal)]';
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${mark} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${mark} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${mark} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${mark} right-0 bottom-0 border-r-2 border-b-2`} />
    </div>
  );
}

export function GridBackdrop({ className = '' }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 opacity-[0.55] ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 90%)',
      }}
    />
  );
}

export function BlueprintLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="flex h-8 w-8 items-center justify-center"
        style={{ backgroundColor: 'var(--ink)' }}
      >
        <span className="font-data text-xs font-semibold" style={{ color: 'var(--paper)' }}>
          B/
        </span>
      </div>
      <span className="font-display text-lg font-semibold tracking-tight">BusinessOS</span>
    </div>
  );
}

// BARU — wrapper untuk semua halaman auth: background grid, back-to-home, logo + eyebrow
export function AuthShell({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow: string; // contoh: "SIGN IN", "CREATE ACCOUNT"
}) {
  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4"
      style={{ backgroundColor: 'var(--paper)', fontFamily: 'Inter, sans-serif' }}
    >
      <GridBackdrop />

      <Link
        href="/"
        className="absolute top-8 left-8 z-10 inline-flex items-center gap-2 border px-3 py-2 text-xs font-medium transition-transform hover:-translate-y-0.5"
        style={{
          borderColor: 'var(--ink)',
          backgroundColor: 'var(--paper)',
          color: 'var(--ink)',
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="relative z-10 mb-8 flex flex-col items-center gap-3">
        <Link href="/">
          <BlueprintLogo />
        </Link>
        <span
          className="font-data flex items-center gap-2 text-xs"
          style={{ color: 'var(--signal)' }}
        >
          <span className="h-1.5 w-1.5" style={{ backgroundColor: 'var(--amber)' }} />
          {eyebrow}
        </span>
      </div>

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {eyebrow && (
          <span
            className="font-data mb-2 flex items-center gap-2 text-xs"
            style={{ color: 'var(--signal)' }}
          >
            <span className="h-1.5 w-1.5" style={{ backgroundColor: 'var(--amber)' }} />
            {eyebrow}
          </span>
        )}
        <h2
          className="font-display text-3xl font-semibold tracking-tight"
          style={{ color: 'var(--ink)' }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="mt-1 text-sm max-w-2xl"
            style={{ color: 'var(--slate)', fontFamily: 'Inter, sans-serif' }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

// BARU — class button primer & outline standar (biar semua page konsisten)
export const btnPrimary =
  'rounded-none border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all';
export const btnOutline = 'rounded-none border-2 border-[var(--ink)] hover:bg-[var(--line)]';
