"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWorkspace, archiveWorkspace, deleteWorkspace } from "@/core/workspaces/actions";
import { updateWorkspaceSchema, UpdateWorkspaceInput } from "@/core/workspaces/schemas";
import { useWorkspace } from "@/core/workspaces/components/WorkspaceProvider";
import { useToast } from "@/shared/hooks/use-toast";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { useRouter } from "next/navigation";
import { CornerMarks } from "@/shared/ui/blueprint";

export function WorkspaceSettingsForm() {
  const { activeWorkspace, role } = useWorkspace();
  const { toast } = useToast();
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: activeWorkspace?.name || "",
      slug: (activeWorkspace as any)?.slug || "",
      image: (activeWorkspace as any)?.image || "",
    },
  });

  if (!activeWorkspace) return null;
  const isOwner = role === "OWNER";
  const isAdmin = role === "ADMIN" || role === "OWNER";

  const onSubmit = async (data: UpdateWorkspaceInput) => {
    if (!isAdmin) return;
    try {
      await updateWorkspace(data);
      toast({ title: "Workspace updated successfully" });
    } catch (error: any) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    }
  };

  const handleArchive = async () => {
    if (!isOwner) return;
    if (confirm("Are you sure you want to archive this workspace? You will lose access to all resources.")) {
      setIsArchiving(true);
      try {
        await archiveWorkspace();
        toast({ title: "Workspace archived" });
        router.push("/dashboard");
      } catch (error: any) {
        toast({ title: "Failed to archive", description: error.message, variant: "destructive" });
        setIsArchiving(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    if (confirm("Are you sure you want to permanently delete this workspace? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await deleteWorkspace(activeWorkspace.id);
        toast({ title: "Workspace deleted" });
        router.push("/dashboard");
      } catch (error: any) {
        toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-[var(--paper)] relative">
        <CornerMarks />
        <CardHeader>
          <CardTitle className="font-display">Workspace Profile</CardTitle>
          <CardDescription style={{ color: "var(--slate)" }}>
            Manage your workspace details and branding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input disabled={!isAdmin || form.formState.isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Slug</FormLabel>
                    <FormControl>
                      <Input disabled={!isAdmin || form.formState.isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Image URL</FormLabel>
                    <FormControl>
                      <Input disabled={!isAdmin || form.formState.isSubmitting} placeholder="https://example.com/logo.png" className="rounded-none border-2 border-[var(--ink)]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isAdmin && (
                <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-none border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {isOwner && (
        <Card className="rounded-none border-2 border-red-600 shadow-[4px_4px_0px_theme(colors.red.600)] bg-[var(--paper)] relative">
          <CornerMarks />
          <CardHeader>
            <CardTitle className="text-red-600 font-display">Danger Zone</CardTitle>
            <CardDescription className="text-red-600/70">
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4 rounded-none border-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-display">Archive Workspace</AlertTitle>
              <AlertDescription>
                Archiving a workspace will hide it and immediately revoke access to all websites and resources within it.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleArchive} disabled={isArchiving || isDeleting} className="rounded-none border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                {isArchiving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Archive Workspace"}
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isArchiving || isDeleting} className="rounded-none border-2 border-red-600 bg-red-600 hover:bg-red-700 hover:border-red-700 shadow-[2px_2px_0px_theme(colors.red.800)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Workspace"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
