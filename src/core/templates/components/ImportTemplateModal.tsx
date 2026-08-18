"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { importCustomTemplate } from "@/core/templates/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

export function ImportTemplateModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const jsonString = event.target?.result as string;
        
        // Let the server action validate and insert
        const res = await importCustomTemplate(jsonString);
        if (res && 'success' in res && !res.success) {
          throw new Error(res.error);
        }
        
        toast({
          title: "Template Imported",
          description: "Your custom template has been added to the library.",
        });
        setOpen(false);
      } catch (error: any) {
        toast({
          title: "Import Failed",
          description: error.message || "Invalid template file.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Custom Template</DialogTitle>
          <DialogDescription>
            Upload a valid `.json` template schema exported from the Builder.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors relative">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Click or drag file to upload</p>
              <p className="text-xs text-muted-foreground mt-1">JSON files only</p>
            </>
          )}
          <input 
            type="file" 
            accept=".json" 
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
            onChange={handleImport}
            disabled={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
