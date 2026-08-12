import { EmptyState } from "@/shared/ui/empty-state";
import { FolderCard } from "./FolderCard";
import { AssetCard } from "./AssetCard";

type Folder = { id: string; name: string };
type Asset = { id: string; url: string; type: string; sizeBytes: number; createdAt: Date };

export function MediaLibrary({ 
  folders, 
  assets 
}: { 
  folders: Folder[]; 
  assets: Asset[];
}) {
  if (folders.length === 0 && assets.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          title="This folder is empty"
          description="Upload files or create sub-folders to get started."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {folders.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Folders</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {folders.map(folder => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        </div>
      )}

      {assets.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Files</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {assets.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
