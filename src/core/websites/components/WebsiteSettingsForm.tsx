"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Image as ImageIcon } from "lucide-react";

import { websiteSettingsSchema, WebsiteSettingsInput } from "@/core/websites/schemas";
import { updateWebsiteSettings } from "@/core/websites/actions";
import { exportWebsiteAsTemplateJSON } from "@/core/templates/actions";
import { useToast } from "@/shared/hooks/use-toast";
import { MediaPickerModal } from "@/core/media/components/MediaPickerModal";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export function WebsiteSettingsForm({ website }: { website: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const defaultValues = website.settings || {
    seo: { metaTitle: "", metaDescription: "", ogTitle: "", ogDescription: "", ogImage: "", twitterTitle: "", twitterDescription: "", twitterImage: "", robotsIndex: true, robotsFollow: true, sitemapIncluded: true, canonicalUrl: "" },
    localization: { language: "en-US", timezone: "UTC" },
    brand: { logoUrl: "", faviconUrl: "" },
    business: { companyName: "", contactEmail: "", social: { twitter: "", linkedin: "", facebook: "" } },
  };

  const form = useForm<WebsiteSettingsInput>({
    resolver: zodResolver(websiteSettingsSchema) as any,
    defaultValues: defaultValues as any,
  });

  async function onSubmit(data: WebsiteSettingsInput) {
    setIsLoading(true);
    try {
      const res = await updateWebsiteSettings(website.id, data);
      if (res && 'success' in res && !res.success) {
        toast({ title: "Error", description: res.error, variant: "destructive" });
      } else {
        toast({ title: "Settings Saved", description: "Your website settings have been updated." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save settings.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExport() {
    try {
      const res = await exportWebsiteAsTemplateJSON(website.id);
      if (res && 'success' in res && !res.success) {
        toast({ title: "Export Failed", description: res.error, variant: "destructive" });
        return;
      }
      if (res.json) {
        const blob = new Blob([res.json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${website.name}-template.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Export Successful", description: "Template JSON downloaded." });
      }
    } catch (error: any) {
      toast({ title: "Export Failed", description: error.message || "An error occurred.", variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="brand" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="brand">Brand</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="localization">Localization</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>

          <TabsContent value="brand">
            <Card>
              <CardHeader>
                <CardTitle>Brand Assets</CardTitle>
                <CardDescription>Manage your website's logo and favicon.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="brand.logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand.faviconUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favicon URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/favicon.ico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Search Engine Optimization</CardTitle>
                <CardDescription>Improve your ranking on Google and social media.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seo.metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Global Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="My SaaS - Best Tool Ever" {...field} />
                      </FormControl>
                      <FormDescription>Max 60 characters recommended.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seo.metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Global Meta Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A brief description of your product." {...field} />
                      </FormControl>
                      <FormDescription>Max 160 characters recommended.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seo.canonicalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormDescription>The primary URL for the homepage.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Social Sharing</CardTitle>
                <CardDescription>How your site appears on social networks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seo.ogTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenGraph Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Overrides meta title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seo.ogDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenGraph Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Overrides meta description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seo.ogImage"
                  render={({ field }) => (
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
                  )}
                />
                <div className="pt-4 border-t space-y-4">
                  <h4 className="text-sm font-medium">Twitter (X) Specific</h4>
                  <FormField
                    control={form.control}
                    name="seo.twitterTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Overrides OG title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seo.twitterDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Overrides OG description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seo.twitterImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Image</FormLabel>
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
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Search Engine Visibility</CardTitle>
                <CardDescription>Control how search engines crawl your site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="seo.robotsIndex" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Index Site</FormLabel>
                      <FormDescription>Allow search engines to index your website.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="seo.robotsFollow" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Follow Links</FormLabel>
                      <FormDescription>Allow search engines to follow links on your website.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="seo.sitemapIncluded" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Include in Sitemap</FormLabel>
                      <FormDescription>Generate a dynamic sitemap.xml for this website.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="localization">
            <Card>
              <CardHeader>
                <CardTitle>Localization</CardTitle>
                <CardDescription>Configure language and time settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="localization.language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="fr-FR">French</SelectItem>
                          <SelectItem value="de-DE">German</SelectItem>
                          <SelectItem value="es-ES">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="localization.timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (US)</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Contact details and social links.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="business.companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="business.contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input placeholder="hello@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium">Social Profiles</h4>
                  <FormField
                    control={form.control}
                    name="business.social.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter (X) URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/yourbrand" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="business.social.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/company/yourbrand" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between border-t pt-6">
          <Button type="button" variant="outline" onClick={handleExport}>
            Export Website as Template JSON
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
}
