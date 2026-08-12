import { prisma } from "@/shared/lib/prisma";
import { getWebsiteById } from "@/core/websites/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { FormsList } from "@/core/forms/components/FormsList";

export default async function FormsDashboard({ params }: { params: Promise<{ websiteId: string }> }) {
  const resolvedParams = await params;
  
  let website;
  try {
    website = await getWebsiteById(resolvedParams.websiteId);
  } catch (e) {
    notFound();
  }

  const forms = await prisma.form.findMany({
    where: { websiteId: resolvedParams.websiteId },
    include: { _count: { select: { submissions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/websites">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Form Builder</h2>
          <p className="text-muted-foreground">
            Create custom forms and manage incoming submissions for {website.name}.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <FormsList websiteId={resolvedParams.websiteId} forms={forms} />
      </div>
    </div>
  );
}
