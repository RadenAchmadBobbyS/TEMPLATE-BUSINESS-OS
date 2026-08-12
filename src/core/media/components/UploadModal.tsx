"use client";

import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

import { getUploadUrl, finalizeUpload } from "@/core/media/actions";
import { useToast } from "@/shared/hooks/use-toast";

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

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      // 1. Get Presigned URL
      const { uploadUrl, s3Key, publicUrl } = await getUploadUrl(
        file.name,
        file.type,
        file.size
      );

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

      await finalizeUpload({
        folderId: folderId || null,
        name: file.name,
        url: publicUrl,
        type: file.type.startsWith("image/") ? "IMAGE" : "DOCUMENT",
        sizeBytes: file.size,
        s3Key,
        fileHash: pseudoHash,
      });
      
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
      </DialogContent>
    </Dialog>
  );
}
