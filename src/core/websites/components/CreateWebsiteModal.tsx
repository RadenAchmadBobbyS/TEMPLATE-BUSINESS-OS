'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, LayoutTemplate } from 'lucide-react';
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
  const [step, setStep] = useState<'choose' | 'form'>(templateId ? 'form' : 'choose');
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
      if ('error' in newWebsite) {
        throw new Error(newWebsite.error);
      }
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
    <Dialog 
      open={open} 
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setTimeout(() => setStep(templateId ? 'form' : 'choose'), 200);
        }
      }}
    >
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
        ) : step === 'choose' ? (
          <>
            <DialogHeader>
              <DialogTitle>Create Website</DialogTitle>
              <DialogDescription>
                How would you like to start your new website?
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <button
                onClick={() => setStep('form')}
                className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-[var(--signal)] hover:bg-[var(--signal)]/5"
                style={{ borderColor: 'var(--line)' }}
              >
                <div className="rounded-full bg-[var(--paper)] p-3 shadow-sm border border-[var(--line)]">
                  <Plus className="h-6 w-6 text-[var(--ink)]" />
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-sm text-[var(--ink)]">Blank Space</h4>
                  <p className="text-xs text-[var(--slate)] mt-1">Start from scratch</p>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setOpen(false);
                  router.push('/dashboard/templates');
                }}
                className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-[var(--line)] p-6 transition-colors hover:border-[var(--amber)] hover:bg-[var(--amber)]/5"
              >
                <div className="rounded-full bg-[var(--paper)] p-3 shadow-sm border border-[var(--line)]">
                  <LayoutTemplate className="h-6 w-6 text-[var(--ink)]" />
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-sm text-[var(--ink)]">From Templates</h4>
                  <p className="text-xs text-[var(--slate)] mt-1">Use a pre-built design</p>
                </div>
              </button>
            </div>
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
