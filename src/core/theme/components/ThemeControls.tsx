"use client";

import { useThemeStore } from "@/core/theme/store";
import { updateWebsiteTheme, resetWebsiteTheme } from "@/core/theme/actions";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { Download, Upload, RotateCcw, Save, Loader2 } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { useState } from "react";

const PRESETS = {
  ocean: "200 98% 39%", // Ocean Blue
  rose: "346.8 77.2% 49.8%", // Rose
  emerald: "142.1 76.2% 36.3%", // Emerald
  midnight: "222.2 47.4% 11.2%", // Midnight
};

export function ThemeControls({ websiteId }: { websiteId: string }) {
  const { config, updateColor, updateRadius, resetTheme, setTheme } = useThemeStore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleExport = () => {
    const data = JSON.stringify(config, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme-${websiteId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.colors && json.radius) {
          setTheme(json);
          toast({ title: "Theme imported successfully" });
        }
      } catch {
        toast({ title: "Invalid theme file", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const res = await resetWebsiteTheme(websiteId);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      resetTheme(); // Client side update to fallback
      toast({ title: "Theme reset to default" });
    } catch (e: any) {
      toast({ title: "Reset failed", description: e.message, variant: "destructive" });
    } finally {
      setIsResetting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateWebsiteTheme(websiteId, config);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      toast({ title: "Theme Saved", description: "Your CSS variables have been published." });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-80 border-r bg-background flex flex-col h-full shrink-0">
      <div className="p-4 border-b flex items-center justify-between">
        <span className="font-semibold">Configuration</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleReset} disabled={isResetting} title="Reset">
            {isResetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleExport} title="Export JSON">
            <Download className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" title="Import JSON">
              <Upload className="h-4 w-4" />
            </Button>
            <input 
              type="file" 
              accept=".json" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleImport}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Colors */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Color Presets</Label>
            <div className="flex gap-2 mt-2">
              {Object.entries(PRESETS).map(([name, hsl]) => (
                <button
                  key={name}
                  onClick={() => updateColor("primary", hsl)}
                  className={`h-8 w-8 rounded-full border-2 ${config.colors.primary === hsl ? 'border-primary' : 'border-transparent'}`}
                  style={{ backgroundColor: `hsl(${hsl})` }}
                  title={name}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Radius */}
        <div className="space-y-4">
          <Label className="text-xs font-semibold uppercase text-muted-foreground">Border Radius</Label>
          <div className="flex gap-2">
            {["0", "0.3rem", "0.5rem", "1rem"].map((r) => (
              <Button 
                key={r} 
                variant={config.radius === r ? "default" : "outline"}
                onClick={() => updateRadius(r)}
                className="flex-1"
              >
                {r === "0" ? "None" : r === "0.3rem" ? "Sm" : r === "0.5rem" ? "Md" : "Lg"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button className="w-full" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
          Publish Theme
        </Button>
      </div>
    </div>
  );
}
