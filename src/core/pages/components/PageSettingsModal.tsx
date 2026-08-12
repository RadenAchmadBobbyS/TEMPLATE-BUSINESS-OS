"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { MediaPickerModal } from "@/core/media/components/MediaPickerModal";

import { pageSettingsSchema } from "@/core/pages/schemas";
import { updatePageSettings } from "@/core/pages/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Switch } from "@/shared/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

// We extend the settings schema with title and slug to edit them here too
const editPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),
    twitterTitle: z.string().optional(),
    twitterDescription: z.string().optional(),
    twitterImage: z.string().optional(),
    canonicalUrl: z.string().optional(),
    noIndex: z.boolean(),
    noFollow: z.boolean().default(false),
    sitemapIncluded: z.boolean().default(true),
  }),
  security: z.object({
    isPasswordProtected: z.boolean(),
    passwordHash: z.string().optional(),
  }),
});

export function PageSettingsModal({ page, open, onOpenChange }: { page: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof editPageSchema>>({
    resolver: zodResolver(editPageSchema) as any,
    defaultValues: {
      title: page.title,
      slug: page.slug,
      seo: page.settings?.seo || { 
        metaTitle: "", metaDescription: "", keywords: "", ogTitle: "", ogDescription: "", ogImage: "", 
        twitterTitle: "", twitterDescription: "", twitterImage: "", canonicalUrl: "", 
        noIndex: false, noFollow: false, sitemapIncluded: true 
      },
      security: page.settings?.security || { isPasswordProtected: false, passwordHash: "" },
    },
  });

  async function onSubmit(data: z.infer<typeof editPageSchema>) {
    setIsLoading(true);
    try {
      await updatePageSettings(page.id, data);
      toast({ title: "Page settings updated" });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Page Settings: {page.title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 pt-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl><Input {...field} disabled={page.slug === "/"} /></FormControl>
                    <FormDescription>Homepage must always remain "/"</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 pt-4">
                <FormField control={form.control} name="seo.metaTitle" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl><Input placeholder="Overrides global title" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="seo.metaDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="seo.canonicalUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canonical URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="seo.keywords" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl><Input placeholder="keyword1, keyword2" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="pt-4 border-t space-y-4">
                  <h4 className="text-sm font-medium">Social Sharing</h4>
                  <FormField control={form.control} name="seo.ogTitle" render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenGraph Title</FormLabel>
                      <FormControl><Input placeholder="Overrides meta title" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="seo.ogDescription" render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenGraph Description</FormLabel>
                      <FormControl><Textarea placeholder="Overrides meta description" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="seo.ogImage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenGraph Image</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="https://..." {...field} className="flex-1" />
                          <MediaPickerModal onSelect={(url) => field.onChange(url)}>
                            <Button type="button" variant="outline" size="icon">
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          </MediaPickerModal>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="pt-4 border-t space-y-4">
                  <h4 className="text-sm font-medium">Search Engines</h4>
                  <FormField control={form.control} name="seo.noIndex" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">No Index</FormLabel>
                        <FormDescription>Hide from search engines.</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="seo.noFollow" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">No Follow</FormLabel>
                        <FormDescription>Prevent search engines from following links on this page.</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="seo.sitemapIncluded" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Include in Sitemap</FormLabel>
                        <FormDescription>Include this page in the sitemap.xml.</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 pt-4">
                <FormField control={form.control} name="security.isPasswordProtected" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-amber-500/20 bg-amber-500/5">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-amber-600">Password Protection</FormLabel>
                      <FormDescription>Require visitors to enter a password to view this page.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
                {form.watch("security.isPasswordProtected") && (
                  <FormField control={form.control} name="security.passwordHash" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Password</FormLabel>
                      <FormControl><Input type="password" placeholder="Enter a secure password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end border-t pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Settings
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
