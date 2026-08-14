"use client";

import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { getUploadUrl, finalizeUpload } from "@/core/media/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { useWorkspace } from "@/core/workspaces/components/WorkspaceProvider";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";

export function UploadModal({ folderId, children }: { folderId?: string, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { activeWorkspace } = useWorkspace();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      // 1. Get Presigned URL
      const res1 = await getUploadUrl(
        file.name,
        file.type,
        file.size
      );
      if (!res1.success) {
        throw new Error(res1.error || "Failed to get upload URL.");
      }
      const { uploadUrl, s3Key, publicUrl } = res1;

      if (!uploadUrl || !s3Key || !publicUrl) {
        throw new Error("Missing required upload parameters.");
      }

      // 2. Upload to S3 directly from browser
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to storage.");
      }

      // 3. Finalize
      // Simple client-side pseudo-hash for MVP (in production use crypto.subtle.digest)
      const pseudoHash = `${file.name}-${file.size}-${file.lastModified}`;

      const res2 = await finalizeUpload({
        folderId: folderId || null,
        name: file.name,
        url: publicUrl!,
        type: file.type.startsWith("image/") ? "IMAGE" : "DOCUMENT",
        sizeBytes: file.size,
        s3Key: s3Key!,
        fileHash: pseudoHash,
      });

      if (!res2.success) {
        throw new Error(res2.error || "Failed to finalize upload.");
      }
      
      toast({
        title: "Success",
        description: "File uploaded successfully.",
      });
      setOpen(false);
      setFile(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px]">
        {!activeWorkspace ? (
          <>
            <DialogHeader>
              <DialogTitle>Workspace Required</DialogTitle>
              <DialogDescription>
                You need an active workspace to upload files. Please create or switch to a workspace first.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>
                Select a file to upload to the media library.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">Asset</Label>
                <Input 
                  id="file" 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isLoading}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !file}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  Upload
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
