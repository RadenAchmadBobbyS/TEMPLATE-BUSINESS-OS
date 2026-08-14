"use client";

import { useState } from "react";
import { updateAssetSettings, replaceAsset, toggleFavoriteAsset } from "@/core/media/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { Crop, FileType2, Settings2, Download, RefreshCw, Loader2, Image as ImageIcon, Heart } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

export function AssetEditorModal({ 
  asset, 
  isOpen, 
  onClose 
}: { 
  asset: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [name, setName] = useState(asset.name || asset.s3Key);
  const [isFavorite, setIsFavorite] = useState(asset.isFavorite);
  
  // Image Processing State Mocks
  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState([85]);
  const [isCropping, setIsCropping] = useState(false);
  const [cropData, setCropData] = useState({ width: 0, height: 0 });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const res = await updateAssetSettings(asset.id, {
        name,
        metadata: {
          ...asset.metadata,
          processedFormat: format,
          quality: quality[0],
          crop: cropData
        }
      });
      if (!res.success) {
        toast({ title: "Error", description: res.error || "Failed to save settings", variant: "destructive" });
        return;
      }
      toast({ title: "Asset settings saved" });
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    try {
      const res = await toggleFavoriteAsset(asset.id);
      if (!res.success) {
        throw new Error(res.error || "Failed to toggle favorite");
      }
    } catch (e: any) {
      setIsFavorite(!newValue); // revert
      toast({ title: "Error", description: e.message || "Failed to toggle favorite", variant: "destructive" });
    }
  };

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await replaceAsset(asset.id, formData);
      if (!res.success) {
        toast({ title: "Replacement Failed", description: res.error || "Failed to replace asset", variant: "destructive" });
        return;
      }
      toast({ title: "Asset replaced successfully", description: "All URLs remain intact." });
      onClose();
    } catch (error: any) {
      toast({ title: "Replacement Failed", description: error.message || "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0 flex flex-col md:flex-row h-[80vh]">
        {/* Left side: Image Preview & Processing */}
        <div className="flex-1 bg-black/95 relative flex flex-col">
          <div className="p-4 flex justify-between items-center text-white/70 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="text-xs truncate max-w-[200px]">{name}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-white hover:bg-white/20" onClick={() => setIsCropping(!isCropping)}>
                <Crop className="h-4 w-4 mr-2" /> {isCropping ? "Done Cropping" : "Crop"}
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
            {/* The Image Preview */}
            <div className={`relative ${isCropping ? 'ring-2 ring-primary ring-offset-4 ring-offset-black/95' : ''}`}>
              <img 
                src={asset.url} 
                alt={name} 
                className="max-h-[50vh] object-contain shadow-2xl rounded-sm"
              />
              
              {/* Mock Crop Overlay */}
              {isCropping && (
                <div className="absolute inset-10 border-2 border-white border-dashed bg-white/10 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="text-white bg-black/50 px-2 py-1 text-xs rounded">Drag to crop</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-black border-t border-white/10 text-xs text-white/50 flex justify-between">
            <span>Original: {(asset.sizeBytes / 1024).toFixed(1)} KB</span>
            <span className="text-primary font-medium">Est. WebP: {((asset.sizeBytes / 1024) * (quality[0]/100) * 0.6).toFixed(1)} KB</span>
          </div>
        </div>

        {/* Right side: Settings & Metadata */}
        <div className="w-full md:w-[320px] bg-card flex flex-col border-l">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-lg">Asset Editor</h3>
            <p className="text-xs text-muted-foreground mt-1">Configure metadata & processing.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
              <Label>File Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 cursor-pointer" onClick={handleToggleFavorite}>
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                Favorite Asset
              </Label>
              <Switch checked={isFavorite} onChange={handleToggleFavorite} />
            </div>

            <div className="pt-4 border-t space-y-4">
              <Label className="flex items-center font-semibold text-sm">
                <Settings2 className="h-4 w-4 mr-2" /> Processing Pipeline
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant={format === "webp" ? "default" : "outline"} size="sm" onClick={() => setFormat("webp")}>WebP (Next-Gen)</Button>
                <Button variant={format === "jpeg" ? "default" : "outline"} size="sm" onClick={() => setFormat("jpeg")}>JPEG</Button>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs">
                  <Label>Compression Quality</Label>
                  <span className="font-medium text-primary">{quality[0]}%</span>
                </div>
                <Slider 
                  value={quality[0]} 
                  onChange={(e: any) => setQuality([parseInt(e.target.value)])} 
                  max={100} 
                  step={1}
                />
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <Label className="flex items-center font-semibold text-sm">
                <RefreshCw className="h-4 w-4 mr-2" /> Replace File
              </Label>
              <p className="text-xs text-muted-foreground">Replacing the file will update the URL everywhere it is used instantly.</p>
              
              <div className="relative">
                <Button variant="outline" className="w-full relative overflow-hidden">
                  <FileType2 className="mr-2 h-4 w-4" /> Upload Replacement
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleReplace}
                    accept="image/*,video/*,application/pdf"
                  />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-muted/30">
            <Button className="w-full" onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save & Process"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
