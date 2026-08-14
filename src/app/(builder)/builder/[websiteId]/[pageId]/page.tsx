import { BuilderShell } from "@/core/builder/components/BuilderShell";
import { getPageVersion } from "@/core/builder/actions";
import { BuilderClientInitializer } from "./BuilderClientInitializer";

export default async function BuilderPage({ params }: { params: Promise<{ websiteId: string; pageId: string }> }) {
  const resolvedParams = await params;
  
  const { nodeTree, versionNumber, isReadOnly } = await getPageVersion(resolvedParams.pageId);
  
  return (
    <BuilderClientInitializer document={nodeTree} isReadOnly={isReadOnly}>
      <BuilderShell websiteId={resolvedParams.websiteId} pageId={resolvedParams.pageId} />
    </BuilderClientInitializer>
  );
}
