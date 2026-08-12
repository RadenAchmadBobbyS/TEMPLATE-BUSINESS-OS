import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";

export function WebsiteSkeleton({ view = "grid" }: { view?: "grid" | "list" }) {
  const items = Array.from({ length: 8 });

  if (view === "list") {
    return (
      <div className="flex flex-col gap-4 w-full">
        {items.map((_, i) => (
          <Card key={i} className="flex flex-row items-center justify-between p-4 w-full h-[72px]">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-[80px] rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((_, i) => (
        <Card key={i} className="flex flex-col justify-between overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full rounded-md" />
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-3">
            <Skeleton className="h-5 w-[60px] rounded-full" />
            <Skeleton className="h-3 w-[100px]" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
