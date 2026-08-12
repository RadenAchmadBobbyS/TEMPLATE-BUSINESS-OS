"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Database, Settings2, Trash2, Loader2, ArrowRight } from "lucide-react";
import { createCmsModel, deleteCmsModel } from "@/core/cms/actions";
import { CmsFieldInput } from "@/core/cms/schemas";
import { useToast } from "@/shared/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { CornerMarks } from "@/shared/ui/blueprint";
import { FadeIn, StaggerContainer, StaggerItem } from "@/shared/ui/motion";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

export function ModelBuilder({ websiteId, models }: { websiteId: string, models: any[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [fields, setFields] = useState<CmsFieldInput[]>([
    { id: uuidv4(), label: "Title", type: "text", required: true }
  ]);

  const addField = () => {
    setFields([...fields, { id: uuidv4(), label: "", type: "text", required: false }]);
  };

  const updateField = (index: number, updates: Partial<CmsFieldInput>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleCreate = async () => {
    if (!name) return toast({ title: "Name required", variant: "destructive" });
    if (fields.length === 0) return toast({ title: "At least one field required", variant: "destructive" });
    
    // Ensure labels are converted to clean IDs (e.g., "Blog Title" -> "blog_title")
    const schema = fields.map(f => ({
      ...f,
      id: f.id.length > 8 ? f.label.toLowerCase().replace(/[^a-z0-9]/g, '_') : f.id
    }));

    setIsLoading(true);
    try {
      await createCmsModel(websiteId, { name, schema });
      toast({ title: "Collection created" });
      setIsCreateOpen(false);
      setName("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will delete all entries in this collection forever.")) {
      try {
        await deleteCmsModel(id);
        toast({ title: "Collection deleted" });
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem className="flex justify-between items-center">
        <h3 className="text-xl font-semibold font-display">Content Collections</h3>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger render={
            <Button className="rounded-none transition-transform hover:-translate-y-0.5" style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}>
              <Plus className="mr-2 h-4 w-4" /> New Collection
            </Button>
          } />
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
              <DialogDescription>Define the structure (schema) for your custom content.</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Collection Name</Label>
                <Input placeholder="e.g. Blog Posts, Products, Testimonials" value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Data Schema Fields</Label>
                  <Button variant="outline" size="sm" onClick={addField}>
                    <Plus className="mr-2 h-4 w-4" /> Add Field
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {fields.map((field, i) => (
                    <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/20">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Field Label</Label>
                            <Input value={field.label} onChange={e => updateField(i, { label: e.target.value })} placeholder="e.g. Cover Image" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Data Type</Label>
                            <Select value={field.type} onValueChange={(val: any) => updateField(i, { type: val })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Short Text</SelectItem>
                                <SelectItem value="textarea">Long Text</SelectItem>
                                <SelectItem value="richtext">Rich Text / WYSIWYG</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date & Time</SelectItem>
                                <SelectItem value="boolean">Boolean (True/False)</SelectItem>
                                <SelectItem value="image">Media Asset</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={field.required} onChange={(e: any) => updateField(i, { required: e.target.checked })} />
                          <Label className="text-xs text-muted-foreground">Required Field</Label>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeField(i)} className="text-destructive mt-6">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleCreate} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Collection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(model => (
          <div key={model.id} className="relative rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] p-6 bg-[var(--paper)] hover:-translate-y-1 transition-transform group flex flex-col justify-between">
            <CornerMarks />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-[rgba(36,81,255,0.06)] flex items-center justify-center border border-[var(--line)]">
                  <Database className="h-5 w-5" style={{ color: "var(--signal)" }} />
                </div>
                <h4 className="font-semibold text-lg font-display">{model.name}</h4>
              </div>
              <p className="text-sm mt-4" style={{ color: "var(--slate)" }}>
                <span className="font-medium" style={{ color: "var(--ink)" }}>{((model.schema as any[]) || []).length}</span> schema fields defined.
              </p>
            </div>
            
            <div className="mt-6 flex items-center gap-2">
              <Button render={
                <Link href={`/dashboard/websites/${websiteId}/cms/${model.id}`}>
                  Manage Entries <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              } className="flex-1 rounded-none border-[var(--line)] hover:bg-[var(--ink)]/5 transition-colors" variant="outline" />
              <Button variant="ghost" size="icon" className="rounded-none text-destructive opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-destructive/30 hover:bg-destructive/10" onClick={() => handleDelete(model.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {models.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-[var(--line)] rounded-none text-[var(--slate)]">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-display">No content collections created yet.</p>
            <p className="text-sm mt-1">Create a "Blog Posts" or "Testimonials" collection to get started.</p>
          </div>
        )}
      </StaggerItem>
    </StaggerContainer>
  );
}
