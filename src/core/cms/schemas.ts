import { z } from "zod";

export const cmsFieldTypeSchema = z.enum(["text", "textarea", "richtext", "number", "boolean", "date", "image"]);

export const cmsFieldSchema = z.object({
  id: z.string(), // e.g. "title", "content"
  label: z.string().min(1), // e.g. "Blog Title"
  type: cmsFieldTypeSchema,
  required: z.boolean().default(false),
  options: z.any().optional(), // For future use (e.g., select options)
});

export type CmsFieldInput = z.infer<typeof cmsFieldSchema>;

export const createModelSchema = z.object({
  name: z.string().min(1, "Model name is required"), // e.g. "Blog Posts"
  schema: z.array(cmsFieldSchema).min(1, "At least one field is required"),
});

export type CreateModelInput = z.infer<typeof createModelSchema>;

export const entryStatusSchema = z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]);

export const updateEntrySchema = z.object({
  data: z.record(z.string(), z.any()), // Dynamic record matching the schema fields
  status: entryStatusSchema,
});
