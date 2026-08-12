import { LoadingState } from '@/shared/ui/loading-state';

export default function DashboardLoading() {
  return (
    <div
      className="flex h-full w-full items-center justify-center font-data"
    >
      <LoadingState message="Loading dashboard..." />
    </div>
  );
}
