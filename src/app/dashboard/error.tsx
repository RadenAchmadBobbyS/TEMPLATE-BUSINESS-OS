"use client";

import { AlertCircle, RefreshCcw } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Button } from '@/shared/ui/button';

export function ErrorState({
  className,
  title = 'Something went wrong',
  error,
  retryAction,
}: {
  className?: string;
  title?: string;
  error?: Error | string;
  retryAction?: () => void;
}) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div
      className={cn(
        'relative flex w-full max-w-md flex-col items-center border-2 bg-[var(--paper)] p-8 text-center',
        className,
      )}
      style={{
        borderColor: 'var(--destructive)',
        boxShadow: '6px 6px 0px var(--destructive)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <span
        className="mb-5 flex items-center gap-2 text-xs font-data" style={{ color: 'var(--destructive)' }}
      >
        <span className="h-1.5 w-1.5" style={{ backgroundColor: 'var(--destructive)' }} />
        ERROR
      </span>

      <div
        className="mb-4 flex h-12 w-12 items-center justify-center border-2"
        style={{ borderColor: 'var(--destructive)' }}
      >
        <AlertCircle className="h-5 w-5" style={{ color: 'var(--destructive)' }} />
      </div>

      <h3
        className="text-lg font-semibold tracking-tight font-display" style={{ color: 'var(--destructive)' }}
      >
        {title}
      </h3>

      {errorMessage && (
        <p className="mt-2 max-w-sm text-sm" style={{ color: 'var(--destructive)', opacity: 0.75 }}>
          {errorMessage}
        </p>
      )}

      {retryAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={retryAction}
          className="mt-6 h-10 rounded-none border-2 px-5 text-sm font-medium transition-transform hover:-translate-y-0.5"
          style={{ borderColor: 'var(--destructive)', color: 'var(--destructive)' }}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
      <ErrorState 
        title="Dashboard Error" 
        error={error} 
        retryAction={reset} 
      />
    </div>
  );
}
