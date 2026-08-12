"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Settings2, Trash2, Loader2, ArrowRight, Table } from "lucide-react";
import { createForm, deleteForm } from "@/core/forms/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { FormFieldInput } from "@/core/forms/schemas";
import { v4 as uuidv4 } from "uuid";

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

export function FormsList({ websiteId, forms }: { websiteId: string, forms: any[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [fields, setFields] = useState<FormFieldInput[]>([
    { id: uuidv4(), label: "Name", type: "text", required: true },
    { id: uuidv4(), label: "Email", type: "email", required: true },
    { id: uuidv4(), label: "Message", type: "textarea", required: false }
  ]);
  const [successUrl, setSuccessUrl] = useState("");
  const [notifyEmails, setNotifyEmails] = useState("");
  const [captcha, setCaptcha] = useState(false);

  const addField = () => {
    setFields([...fields, { id: uuidv4(), label: "", type: "text", required: false }]);
  };

  const updateField = (index: number, updates: Partial<FormFieldInput>) => {
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
    
    // Normalize IDs
    const normalizedFields = fields.map(f => ({
      ...f,
      id: f.id.length > 8 ? f.label.toLowerCase().replace(/[^a-z0-9]/g, '_') : f.id
    }));

    setIsLoading(true);
    try {
      await createForm(websiteId, { 
        name, 
        fields: normalizedFields,
        settings: {
          successPageUrl: successUrl || undefined,
          notificationEmails: notifyEmails.split(',').map(e => e.trim()).filter(e => e.includes('@')),
          captchaEnabled: captcha
        }
      });
      toast({ title: "Form created" });
      setIsCreateOpen(false);
      setName("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will delete the form and ALL its submissions.")) {
      try {
        await deleteForm(id);
        toast({ title: "Form deleted" });
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Active Forms</h3>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger render={
            <Button><Plus className="mr-2 h-4 w-4" /> New Form</Button>
          } />
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
              <DialogDescription>Define the form fields and configure submission routing.</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Form Name</Label>
                <Input placeholder="e.g. Contact Us, Newsletter Signup" value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Form Fields</Label>
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
                            <Input value={field.label} onChange={e => updateField(i, { label: e.target.value })} placeholder="e.g. Phone Number" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Input Type</Label>
                            <Select value={field.type} onValueChange={(val: any) => updateField(i, { type: val })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Short Text</SelectItem>
                                <SelectItem value="textarea">Long Message</SelectItem>
                                <SelectItem value="email">Email Address</SelectItem>
                                <SelectItem value="phone">Phone Number</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="select">Dropdown (Select)</SelectItem>
                                <SelectItem value="checkbox">Checkbox</SelectItem>
                                <SelectItem value="radio">Radio Buttons</SelectItem>
                                <SelectItem value="date">Date Picker</SelectItem>
                                <SelectItem value="file">File Upload</SelectItem>
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

              <div className="space-y-4 pt-6 border-t">
                <h4 className="font-semibold">Routing & Notifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Success Page URL</Label>
                    <Input placeholder="/thank-you" value={successUrl} onChange={e => setSuccessUrl(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Notification Emails (comma separated)</Label>
                    <Input placeholder="sales@example.com" value={notifyEmails} onChange={e => setNotifyEmails(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch checked={captcha} onChange={(e: any) => setCaptcha(e.target.checked)} />
                  <Label>Enable anti-spam CAPTCHA</Label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleCreate} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Form
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map(form => (
          <div key={form.id} className="border rounded-lg p-6 bg-card hover:border-primary/50 transition-colors group relative flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                  <Table className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{form.name}</h4>
                  <p className="text-sm text-muted-foreground">{form._count.submissions} Submissions</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2">
              <Button render={
                <Link href={`/dashboard/websites/${websiteId}/forms/${form.id}`}>
                  View Data <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              } className="flex-1" variant="secondary" />
              <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(form.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {forms.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg text-muted-foreground">
            <Table className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No forms created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
