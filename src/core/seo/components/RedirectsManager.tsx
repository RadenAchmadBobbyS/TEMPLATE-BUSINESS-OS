"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, ArrowRightLeft, Link as LinkIcon, Loader2, Edit, Check, X } from "lucide-react";

import { createRedirect, deleteRedirect, updateRedirect } from "@/core/seo/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";

export function RedirectsManager({ websiteId, initialRedirects }: { websiteId: string, initialRedirects: any[] }) {
  const { toast } = useToast();
  const [redirects, setRedirects] = useState(initialRedirects);
  
  // Create State
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("301");
  const [isAdding, setIsAdding] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSource, setEditSource] = useState("");
  const [editDestination, setEditDestination] = useState("");
  const [editType, setEditType] = useState("301");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!source || !destination) return;
    setIsAdding(true);
    try {
      const res = await createRedirect(websiteId, source, destination, type === "301");
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      setRedirects([res.redirect, ...redirects]);
      setSource("");
      setDestination("");
      toast({ title: "Redirect Created" });
    } catch (error: any) {
      toast({ title: error.message || "Failed to create redirect", variant: "destructive" });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await deleteRedirect(id, websiteId);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      setRedirects(redirects.filter(r => r.id !== id));
      toast({ title: "Redirect Deleted" });
    } catch (error: any) {
      toast({ title: error.message || "Delete Failed", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (rule: any) => {
    setEditingId(rule.id);
    setEditSource(rule.source);
    setEditDestination(rule.destination);
    setEditType(rule.permanent ? "301" : "302");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id: string) => {
    setIsUpdating(true);
    try {
      const res = await updateRedirect(id, websiteId, {
        source: editSource,
        destination: editDestination,
        permanent: editType === "301"
      });
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      setRedirects(redirects.map(r => r.id === id ? res.redirect : r));
      setEditingId(null);
      toast({ title: "Redirect Updated" });
    } catch (error: any) {
      toast({ title: error.message || "Update Failed", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const res = await updateRedirect(id, websiteId, { active });
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      setRedirects(redirects.map(r => r.id === id ? { ...r, active } : r));
      toast({ title: `Redirect ${active ? 'Enabled' : 'Disabled'}` });
    } catch (error: any) {
      toast({ title: error.message || "Toggle Failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Redirect</CardTitle>
          <CardDescription>Preserve SEO rankings when changing page URLs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Source Path</label>
              <Input placeholder="/old-path" value={source} onChange={e => setSource(e.target.value)} />
            </div>
            <div className="flex items-center pb-2 px-2 text-muted-foreground">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Destination Path</label>
              <Input placeholder="/new-path or https://ext.com" value={destination} onChange={e => setDestination(e.target.value)} />
            </div>
            <div className="w-32 space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <Select value={type} onValueChange={(val: any) => setType(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="301">301 (Permanent)</SelectItem>
                  <SelectItem value="302">302 (Temporary)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} disabled={isAdding || !source || !destination}>
              {isAdding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Rule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5" /> Active Redirects</CardTitle>
        </CardHeader>
        <CardContent>
          {redirects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No redirects configured yet.
            </div>
          ) : (
            <div className="divide-y border rounded-md">
              {redirects.map((rule) => (
                <div key={rule.id} className="flex flex-col p-4 hover:bg-muted/50 transition-colors gap-4">
                  
                  {editingId === rule.id ? (
                    <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                      <div className="flex-1 space-y-2">
                        <Input value={editSource} onChange={e => setEditSource(e.target.value)} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input value={editDestination} onChange={e => setEditDestination(e.target.value)} />
                      </div>
                      <div className="w-28 space-y-2">
                        <Select value={editType} onValueChange={(val: any) => setEditType(val)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="301">301</SelectItem>
                            <SelectItem value="302">302</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={cancelEdit} disabled={isUpdating}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="icon" onClick={() => handleUpdate(rule.id)} disabled={isUpdating}>
                          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <Switch 
                          checked={rule.active ?? true} 
                          onChange={(e: any) => toggleActive(rule.id, e.target.checked)}
                          title={rule.active ? "Disable Redirect" : "Enable Redirect"}
                        />
                        <Badge variant={rule.permanent ? "default" : "secondary"}>
                          {rule.permanent ? "301" : "302"}
                        </Badge>
                        <div className="flex items-center gap-2 font-mono text-sm">
                          <span className={`font-medium ${!(rule.active ?? true) && "opacity-50 line-through"}`}>{rule.source}</span>
                          <ArrowRightLeft className={`h-3 w-3 text-muted-foreground ${!(rule.active ?? true) && "opacity-50"}`} />
                          <span className={`text-muted-foreground ${!(rule.active ?? true) && "opacity-50 line-through"}`}>{rule.destination}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground hidden md:inline-block">
                          {format(new Date(rule.createdAt), "MMM d, yyyy")}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => startEdit(rule)} disabled={deletingId === rule.id}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(rule.id)} disabled={deletingId === rule.id}>
                          {deletingId === rule.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
