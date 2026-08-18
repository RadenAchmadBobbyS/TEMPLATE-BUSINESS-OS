"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Edit2, Trash2, Plus, Loader2 } from "lucide-react";
import { createCmsEntry, deleteCmsEntry } from "@/core/cms/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { EmptyState } from "@/shared/ui/empty-state";

export function EntryList({ model, entries }: { model: any, entries: any[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const res = await createCmsEntry(model.id);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      const entry = res.entry;
      router.push(`/dashboard/websites/${model.websiteId}/cms/${model.id}/${entry?.id}`);
    } catch (error: any) {
      toast({ title: "Failed to create entry", description: error.message, variant: "destructive" });
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        const res = await deleteCmsEntry(id);
        if (res && 'success' in res && !res.success) throw new Error(res.error);
        toast({ title: "Entry deleted" });
      } catch {
        toast({ title: "Delete Failed", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {/* Filters could go here */}
        </div>
        <Button onClick={handleCreate} disabled={isCreating}>
          {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          New Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <EmptyState 
          title="No entries found" 
          description={`Create your first entry in the ${model.name} collection.`}
        />
      ) : (
        <div className="border rounded-lg bg-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Data Preview</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Last Updated</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map(entry => {
                // Try to find a title field to display
                const data = entry.data as Record<string, any>;
                const titleField = Object.keys(data).find(k => k.toLowerCase().includes('title') || k.toLowerCase().includes('name'));
                const preview = titleField ? data[titleField] : Object.values(data)[0] || "Untitled Entry";

                return (
                  <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium truncate max-w-[300px]">
                      {String(preview).substring(0, 50)}
                      {String(preview).length > 50 ? "..." : ""}
                    </td>
                    <td className="px-6 py-4">
                      {entry.status === "PUBLISHED" && <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Published</Badge>}
                      {entry.status === "DRAFT" && <Badge variant="outline">Draft</Badge>}
                      {entry.status === "SCHEDULED" && <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Scheduled</Badge>}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.updatedAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem render={
                            <Link href={`/dashboard/websites/${model.websiteId}/cms/${model.id}/${entry.id}`}>
                              <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          } />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(entry.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
