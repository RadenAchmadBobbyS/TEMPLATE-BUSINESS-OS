"use client";

import { useState } from "react";
import { updateCmsEntry } from "@/core/cms/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Save, Send, Calendar, Image as ImageIcon } from "lucide-react";
import { MediaPickerModal } from "@/core/media/components/MediaPickerModal";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Badge } from "@/shared/ui/badge";

export function DynamicForm({ model, entry }: { model: any, entry: any }) {
  const schema = model.schema as any[];
  const [data, setData] = useState<Record<string, any>>(entry.data || {});
  const [status, setStatus] = useState<string>(entry.status);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleUpdate = (fieldId: string, value: any) => {
    setData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = async (newStatus?: string) => {
    setIsLoading(true);
    const targetStatus = newStatus || status;
    try {
      await updateCmsEntry(entry.id, { data, status: targetStatus });
      setStatus(targetStatus);
      toast({ title: "Entry saved successfully" });
      router.refresh();
    } catch (error: any) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: any) => {
    const value = data[field.id];

    switch (field.type) {
      case "text":
        return <Input value={value || ""} onChange={e => handleUpdate(field.id, e.target.value)} placeholder={`Enter ${field.label}`} />;
      case "textarea":
      case "richtext": // Fallback to textarea for now since rich text requires a big dependency like TipTap
        return <Textarea value={value || ""} onChange={e => handleUpdate(field.id, e.target.value)} className="min-h-[150px]" />;
      case "number": {
        return <Input type="number" value={value || ""} onChange={e => handleUpdate(field.id, isNaN(parseFloat(e.target.value)) ? "" : parseFloat(e.target.value))} />;
      }
      case "date":
        return <Input type="datetime-local" value={value || ""} onChange={e => handleUpdate(field.id, e.target.value)} />;
      case "boolean":
        return <Switch checked={!!value} onChange={(e: any) => handleUpdate(field.id, e.target.checked)} />;
      case "image":
        return (
          <div className="flex gap-2">
            <Input type="url" value={value || ""} onChange={e => handleUpdate(field.id, e.target.value)} placeholder="https://..." className="flex-1" />
            <MediaPickerModal onSelect={(url) => handleUpdate(field.id, url)}>
              <Button type="button" variant="outline" size="icon">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </MediaPickerModal>
          </div>
        );
      default:
        return <Input value={value || ""} onChange={e => handleUpdate(field.id, e.target.value)} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {schema.map(field => (
              <div key={field.id} className="space-y-2">
                <Label className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}
            
            {schema.length === 0 && (
              <p className="text-muted-foreground text-sm">No fields defined in schema.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Current Status</span>
              {status === "PUBLISHED" && <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Published</Badge>}
              {status === "DRAFT" && <Badge variant="outline">Draft</Badge>}
              {status === "SCHEDULED" && <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Scheduled</Badge>}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>Update Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={() => handleSave()} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
            
            {status !== "PUBLISHED" && (
              <Button variant="secondary" className="w-full" onClick={() => handleSave("PUBLISHED")} disabled={isLoading}>
                <Send className="mr-2 h-4 w-4" /> Publish Now
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Categories / Tags mock for now */}
        <Card>
          <CardHeader>
            <CardTitle>Taxonomies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Define Categories and Tags as array fields in the schema to manage them here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
