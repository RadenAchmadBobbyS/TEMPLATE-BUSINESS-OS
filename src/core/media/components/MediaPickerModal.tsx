"use client";

import { useState, useEffect } from "react";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { getAssets } from "@/core/media/queries";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

type Asset = {
  id: string;
  url: string;
  type: string;
  name?: string | null;
  sizeBytes: number;
};

export function MediaPickerModal({
  onSelect,
  children,
}: {
  onSelect: (url: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      getAssets(null, undefined, undefined)
        .then((data) => {
          // ensure data is serializable or cast properly
          setAssets(data as any);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground space-y-2">
            <ImageIcon className="h-12 w-12 opacity-50" />
            <p>No media found. Upload something in the Media Library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group relative aspect-square bg-muted rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                onClick={() => {
                  onSelect(asset.url);
                  setOpen(false);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.name || "Asset"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
