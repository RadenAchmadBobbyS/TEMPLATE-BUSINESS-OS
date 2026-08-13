'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useWorkspace } from '@/core/workspaces/components/WorkspaceProvider';

import { createWebsiteSchema, CreateWebsiteInput } from '@/core/websites/schemas';
import { createWebsite } from '@/core/websites/actions';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useToast } from '@/shared/hooks/use-toast';

export function CreateWebsiteModal({
  children,
  templateId,
}: {
  children: React.ReactNode;
  templateId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { activeWorkspace } = useWorkspace();

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string' && error.trim()) return error;
    return 'Failed to create website. Please try again.';
  };

  const handleQuotaMessage = (message: string) => {
    if (message.toLowerCase().includes('website limit reached')) {
      return 'Website limit reached. Archived websites still count toward your plan limit.';
    }

    return message;
  };

  const form = useForm<CreateWebsiteInput>({
    resolver: zodResolver(createWebsiteSchema),
    defaultValues: {
      name: '',
      domain: '',
      templateId: templateId || undefined,
    },
  });

  async function onSubmit(data: CreateWebsiteInput) {
    setIsLoading(true);
    setFormError(null);

    try {
      const newWebsite = await createWebsite(data);
      toast({
        title: 'Success',
        description: 'Website created successfully.',
      });
      setOpen(false);
      form.reset();
      router.push(`/dashboard/websites/${newWebsite.id}/pages`);
    } catch (error) {
      const message = handleQuotaMessage(getErrorMessage(error));
      setFormError(message);
      toast({
        title: 'Unable to create website',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px]">
        {!activeWorkspace ? (
          <>
            <DialogHeader>
              <DialogTitle>Workspace Required</DialogTitle>
              <DialogDescription>
                You need to create a workspace before you can create a website from this template.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/workspaces/new${templateId ? `?templateId=${templateId}` : ''}`,
                  )
                }
              >
                Create Workspace
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create Website</DialogTitle>
              <DialogDescription>
                Give your new website a name and optional custom domain.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {formError && (
                  <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {formError}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Site" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Domain (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="example.com" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
