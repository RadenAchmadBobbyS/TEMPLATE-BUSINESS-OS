import { z } from "zod";

export const createWebsiteSchema = z.object({
  name: z.string().min(2, { message: "Website name must be at least 2 characters." }),
  slug: z.string().optional(),
  description: z.string().optional(),
  domain: z.string().optional(),
  templateId: z.string().uuid().optional(),
});

export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;

export const updateWebsiteSchema = z.object({
  name: z.string().min(2, { message: "Website name must be at least 2 characters." }),
  slug: z.string().optional(),
  description: z.string().optional(),
  domain: z.string().optional(),
});

export type UpdateWebsiteInput = z.infer<typeof updateWebsiteSchema>;

const baseMenuItemSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  type: z.enum(["page", "external", "anchor"]),
  target: z.string().optional(), // The URL, Page Slug, or Anchor ID
  pageId: z.string().uuid().optional(), // Explicit reference to the Page for internal links
  icon: z.string().optional(),
});

export type MenuItemInput = z.infer<typeof baseMenuItemSchema> & {
  children?: MenuItemInput[];
};

export const menuItemSchema: z.ZodType<MenuItemInput> = baseMenuItemSchema.extend({
  children: z.lazy(() => menuItemSchema.array().optional()),
});

export const websiteSettingsSchema = z.object({
  seo: z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    ogTitle: z.string().max(90).optional(),
    ogDescription: z.string().max(200).optional(),
    ogImage: z.string().url().optional().or(z.literal("")),
    twitterTitle: z.string().max(70).optional(),
    twitterDescription: z.string().max(200).optional(),
    twitterImage: z.string().url().optional().or(z.literal("")),
    robotsIndex: z.boolean().default(true),
    robotsFollow: z.boolean().default(true),
    sitemapIncluded: z.boolean().default(true),
    canonicalUrl: z.string().url().optional().or(z.literal("")),
  }).optional(),
  localization: z.object({
    language: z.string().default("en-US"),
    timezone: z.string().default("UTC"),
  }).optional(),
  brand: z.object({
    logoUrl: z.string().url().optional().or(z.literal("")),
    faviconUrl: z.string().url().optional().or(z.literal("")),
  }).optional(),
  business: z.object({
    companyName: z.string().optional(),
    industry: z.string().optional(),
    contactEmail: z.string().email().optional().or(z.literal("")),
    social: z.object({
      twitter: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      facebook: z.string().url().optional().or(z.literal("")),
    }).optional(),
  }).optional(),
  navigation: z.object({
    navbar: z.array(menuItemSchema).optional(),
    footer: z.array(menuItemSchema).optional(),
  }).optional(),
});

export type WebsiteSettingsInput = z.infer<typeof websiteSettingsSchema>;
