import { z } from "zod";

export const createPageSchema = z.object({
  title: z.string().min(1, "Page title is required"),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^\/[a-zA-Z0-9\-_]*$/, "Slug must start with '/' and contain only letters, numbers, hyphens, and underscores"),
  parentId: z.string().uuid().optional().nullable(),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;

export const pageSettingsSchema = z.object({
  seo: z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    keywords: z.string().optional(),
    ogTitle: z.string().max(90).optional(),
    ogDescription: z.string().max(200).optional(),
    ogImage: z.string().url().optional().or(z.literal("")),
    twitterTitle: z.string().max(70).optional(),
    twitterDescription: z.string().max(200).optional(),
    twitterImage: z.string().url().optional().or(z.literal("")),
    noIndex: z.boolean().default(false),
    noFollow: z.boolean().default(false),
    sitemapIncluded: z.boolean().default(true),
    canonicalUrl: z.string().url().optional().or(z.literal("")),
  }).optional(),
  security: z.object({
    isPasswordProtected: z.boolean().default(false),
    passwordHash: z.string().optional(),
  }).optional(),
});

export type PageSettingsInput = z.infer<typeof pageSettingsSchema>;
