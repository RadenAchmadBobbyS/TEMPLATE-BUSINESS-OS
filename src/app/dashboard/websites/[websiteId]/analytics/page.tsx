import { getWebsiteById } from '@/core/websites/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';

import {
  getWebsiteAnalytics,
  getAnalyticsGoals,
  getAnalyticsFunnels,
} from '@/core/analytics/actions';
import { AnalyticsDashboard } from '@/core/analytics/components/AnalyticsDashboard';

export default async function AnalyticsPage(props: {
  params: Promise<{ websiteId: string }>;
  searchParams?: Promise<{ start?: string; end?: string }>;
}) {
  const resolvedParams = await props.params;
  const searchParams = await props.searchParams;

  let website;
  try {
    website = await getWebsiteById(resolvedParams.websiteId);
  } catch (e) {
    notFound();
  }

  let startDate: Date | undefined;
  let endDate: Date | undefined;
  if (searchParams?.start) startDate = new Date(searchParams.start);
  if (searchParams?.end) endDate = new Date(searchParams.end);

  const analytics = await getWebsiteAnalytics(website.id, startDate, endDate);
  const goals = await getAnalyticsGoals(website.id);
  const funnels = await getAnalyticsFunnels(website.id);

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/websites">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-muted-foreground text-xl font-bold tracking-tight">{website.name}</h2>
        </div>
      </div>

      <AnalyticsDashboard
        analytics={analytics}
        websiteId={website.id}
        initialGoals={goals}
        initialFunnels={funnels}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
