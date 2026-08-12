"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, Trash2, Expand, Loader2, Heart } from "lucide-react";

import { deleteAsset } from "@/core/media/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { AssetEditorModal } from "./AssetEditorModal";

import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type Asset = {
  id: string;
  url: string;
  type: string;
  sizeBytes: number;
  createdAt: Date;
  name?: string;
  isFavorite?: boolean;
  metadata?: any;
};

export function AssetCard({ asset }: { asset: Asset }) {
  const { toast } = useToast();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + " KB";
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAsset(asset.id);
      toast({ title: "Asset deleted" });
    } catch {
      toast({ title: "Failed to delete asset", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const displayName = asset.name || asset.url.split('/').pop()?.slice(-20) || "asset";

  return (
    <>
      <Card className="group relative overflow-hidden flex flex-col justify-between hover:border-primary/50 transition-colors">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        
        {asset.isFavorite && (
          <div className="absolute top-2 left-2 z-10">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          </div>
        )}

        <CardContent className="p-0 aspect-square relative bg-muted flex items-center justify-center cursor-pointer" onClick={() => setIsEditorOpen(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={asset.url} 
            alt={displayName} 
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              } />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditorOpen(true)}>
                  <Expand className="mr-2 h-4 w-4" /> Edit & Process
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
        <CardFooter className="p-3 bg-card border-t flex flex-col items-start gap-1">
          <p className="text-xs font-medium truncate w-full" title={displayName}>
            {displayName}
          </p>
          <div className="flex justify-between w-full text-[10px] text-muted-foreground">
            <span>{asset.metadata?.processedFormat?.toUpperCase() || asset.type}</span>
            <span>{formatSize(asset.sizeBytes)}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Advanced Asset Editor Modal */}
      {isEditorOpen && (
        <AssetEditorModal 
          asset={asset} 
          isOpen={isEditorOpen} 
          onClose={() => setIsEditorOpen(false)} 
        />
      )}
    </>
  );
}
