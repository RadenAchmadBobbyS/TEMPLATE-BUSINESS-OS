"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, ArrowRightLeft, Link as LinkIcon, Loader2 } from "lucide-react";

import { createRedirect, deleteRedirect } from "@/core/seo/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

export function RedirectsManager({ websiteId, initialRedirects }: { websiteId: string, initialRedirects: any[] }) {
  const { toast } = useToast();
  const [redirects, setRedirects] = useState(initialRedirects);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("301");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!source || !destination) return;
    setIsAdding(true);
    try {
      const redirect = await createRedirect(websiteId, source, destination, type === "301");
      setRedirects([redirect, ...redirects]);
      setSource("");
      setDestination("");
      toast({ title: "Redirect Created" });
    } catch (error: any) {
      toast({ title: "Failed to create redirect", variant: "destructive" });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteRedirect(id, websiteId);
      setRedirects(redirects.filter(r => r.id !== id));
      toast({ title: "Redirect Deleted" });
    } catch (error: any) {
      toast({ title: "Delete Failed", variant: "destructive" });
    } finally {
      setDeletingId(null);
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
                <div key={rule.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Badge variant={rule.permanent ? "default" : "secondary"}>
                      {rule.permanent ? "301" : "302"}
                    </Badge>
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <span className="font-medium">{rule.source}</span>
                      <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{rule.destination}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{format(new Date(rule.createdAt), "MMM d, yyyy")}</span>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(rule.id)} disabled={deletingId === rule.id}>
                      {deletingId === rule.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
