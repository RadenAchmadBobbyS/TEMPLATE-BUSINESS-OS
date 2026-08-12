import { cn } from '@/shared/utils';

export function LoadingState({
  className,
  message = 'Loading...',
}: {
  className?: string;
  message?: string;
}) {
  return (
    <div
      className={cn(
        'animate-in fade-in relative flex flex-col items-center justify-center gap-5 p-8 duration-500',
        className,
      )}
    >
      {/* pulsing dot-grid ring instead of a generic spinner */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div
          className="absolute inset-0 border-2 border-dashed"
          style={{ borderColor: 'var(--ink)', opacity: 0.15 }}
        />
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2.2s' }}>
          <span
            className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
            style={{ backgroundColor: 'var(--signal)' }}
          />
        </div>
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '2.2s', animationDirection: 'reverse' }}
        >
          <span
            className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
            style={{ backgroundColor: 'var(--amber)' }}
          />
        </div>
        <div className="h-3 w-3 animate-pulse" style={{ backgroundColor: 'var(--ink)' }} />
      </div>

      <p
        className="font-data text-[11px] tracking-wider uppercase"
        style={{ color: 'var(--slate)' }}
      >
        {message}
      </p>
    </div>
  );
}
