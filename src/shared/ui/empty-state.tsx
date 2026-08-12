import { LucideIcon, Inbox } from 'lucide-react';
import { CornerMarks } from '@/shared/ui/blueprint';

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className = '',
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col items-center border-2 border-dashed px-8 py-16 text-center ${className}`}
      style={{ borderColor: 'var(--line)', backgroundColor: 'rgba(20,23,31,0.015)' }}
    >
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center border-2"
        style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--paper)' }}
      >
        <Icon className="h-6 w-6" style={{ color: 'var(--signal)' }} />
      </div>
      <h3
        className="font-display text-lg font-semibold tracking-tight"
        style={{ color: 'var(--ink)' }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="mt-2 max-w-sm text-sm"
          style={{ color: 'var(--slate)', fontFamily: 'Inter, sans-serif' }}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
