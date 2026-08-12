"use client";

import { useState } from "react";
import { Search, Globe, Image as ImageIcon, Hash, Code, Loader2 } from "lucide-react";

import { updatePageSeo } from "@/core/seo/actions";
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export function SeoManager({ page, websiteId }: { page: any, websiteId: string }) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Parse existing JSON or fallback to defaults
  const meta = typeof page.seoMetadata === 'object' && page.seoMetadata !== null ? page.seoMetadata : {};
  
  const [title, setTitle] = useState(meta.title || page.title);
  const [description, setDescription] = useState(meta.description || "");
  const [ogImage, setOgImage] = useState(meta.ogImage || "");
  const [twitterCard, setTwitterCard] = useState(meta.twitterCard || "summary_large_image");
  const [canonicalUrl, setCanonicalUrl] = useState(meta.canonicalUrl || "");
  const [schemaJson, setSchemaJson] = useState(meta.schemaJson || "");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        title,
        description,
        ogImage,
        twitterCard,
        canonicalUrl,
        schemaJson
      };
      
      await updatePageSeo(page.id, websiteId, payload);
      toast({ title: "SEO Settings Saved", description: "Metadata updated successfully." });
    } catch (error: any) {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Editor Panel */}
      <div className="md:col-span-2 space-y-6">
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">General Meta Tags</CardTitle>
                <CardDescription>The core tags used by search engines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Title <span className="text-muted-foreground font-normal ml-2">{title.length}/60</span></label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Description <span className="text-muted-foreground font-normal ml-2">{description.length}/160</span></label>
                  <Textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="A brief summary of the page..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Cards</CardTitle>
                <CardDescription>Control how your page looks when shared on Facebook, Twitter, LinkedIn.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Open Graph Image URL</label>
                  <div className="flex gap-2">
                    <div className="bg-muted p-2 border rounded-md flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2"><Hash className="h-4 w-4" /> Twitter Card Type</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={twitterCard} 
                    onChange={e => setTwitterCard(e.target.value)}
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Indexing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Canonical URL</label>
                  <Input value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} placeholder="Leave blank to use default page URL" />
                  <p className="text-xs text-muted-foreground">Used to prevent duplicate content issues.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schema" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Structured Data (JSON-LD)</CardTitle>
                <CardDescription>Rich snippets for Google Search.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea 
                    className="font-mono text-xs bg-muted/50" 
                    rows={12} 
                    value={schemaJson} 
                    onChange={e => setSchemaJson(e.target.value)} 
                    placeholder='{ "@context": "https://schema.org", "@type": "Article", ... }' 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto">
          {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save SEO Settings
        </Button>
      </div>

      {/* Preview Panel */}
      <div>
        <div className="sticky top-6 space-y-6">
          <Card>
            <CardHeader className="bg-muted/50 pb-4 border-b">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-500" /> Google Search Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <div className="text-sm text-[#202124] flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <span>businessos.app &gt; {page.slug}</span>
                </div>
                <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate">
                  {title || "Untitled Page"}
                </h3>
                <p className="text-sm text-[#4d5156] line-clamp-2">
                  {description || "No meta description provided. Google will extract text from the page content instead."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-muted/50 pb-4 border-b">
              <CardTitle className="text-sm flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-400" /> Twitter Card Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 p-0">
              <div className="border rounded-xl overflow-hidden mx-4 mb-6 mt-4 max-w-[400px]">
                {ogImage ? (
                  <div className="aspect-[1.91/1] w-full bg-muted border-b relative">
                    <img src={ogImage} className="absolute inset-0 w-full h-full object-cover" alt="OG" />
                  </div>
                ) : (
                  <div className="aspect-[1.91/1] w-full bg-muted flex items-center justify-center border-b text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-20" />
                  </div>
                )}
                <div className="p-3 bg-muted/10">
                  <p className="text-sm text-muted-foreground">businessos.app</p>
                  <p className="font-bold truncate leading-tight">{title || "Untitled Page"}</p>
                  <p className="text-sm text-muted-foreground truncate">{description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
