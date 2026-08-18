'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPageSchema, CreatePageInput } from '@/core/pages/schemas';
import { createPage } from '@/core/pages/actions';
import { useToast } from '@/shared/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

export function CreatePageModal({ websiteId, pages }: { websiteId: string; pages: any[] }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreatePageInput>({
    resolver: zodResolver(createPageSchema),
    defaultValues: { title: '', slug: '/', parentId: null },
  });

  async function onSubmit(data: CreatePageInput) {
    setIsLoading(true);
    try {
      const res = await createPage(websiteId, data);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      toast({ title: 'Page created successfully' });
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  // Filter out pages that are already children to prevent deep nesting for MVP, or allow 1 level
  const rootPages = pages.filter((p) => !p.parentId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Page
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>Add a new blank page to your website architecture.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Title</FormLabel>
                  <FormControl>
                    <Input placeholder="About Us" {...field} />
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
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="/about" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Page (Optional)</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === 'null' ? null : val)}
                    value={field.value || 'null'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Root Level (None)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">Root Level (None)</SelectItem>
                      {rootPages.map((rp) => (
                        <SelectItem key={rp.id} value={rp.id}>
                          {rp.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Page
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
