import { z } from "zod";
import { themeConfigSchema } from "@/core/theme/schemas";
import { menuItemSchema } from "@/core/websites/schemas";

export const templatePageSchema = z.object({
  id: z.string(), // Internal template ID, e.g. "template-home-id"
  slug: z.string(),
  title: z.string(),
  order: z.number().default(0),
  nodeTree: z.any(), // The page content
});

export const templateCmsModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  schema: z.any(),
});

export const templateCmsEntrySchema = z.object({
  modelId: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).default("PUBLISHED"),
  data: z.any(),
});

export const templateDataSchema = z.object({
  metadata: z.object({
    version: z.string().optional(),
    status: z.string().optional(),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
  pages: z.array(templatePageSchema),
  theme: themeConfigSchema.optional(),
  navigation: z.object({
    navbar: z.array(menuItemSchema).optional(),
    footer: z.array(menuItemSchema).optional(),
  }).optional(),
  cms: z.object({
    models: z.array(templateCmsModelSchema).optional(),
    entries: z.array(templateCmsEntrySchema).optional(),
  }).optional(),
});

export type TemplateData = z.infer<typeof templateDataSchema>;
