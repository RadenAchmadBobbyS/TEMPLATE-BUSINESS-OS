import { LoadingState } from '@/shared/ui/loading-state';

export default function DashboardLoading() {
  return (
    <div className="font-data mt-30 flex h-full w-full items-center justify-center">
      <LoadingState message="Loading" />
    </div>
  );
}
