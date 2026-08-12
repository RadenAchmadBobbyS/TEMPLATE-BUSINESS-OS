import { z } from "zod";

export const componentTypeSchema = z.enum([
  "Container",
  "Section",
  "Stack",
  "Grid",
  "Columns",
  "Heading",
  "Text",
  "Button",
  "Image",
  "Divider",
  "Spacer",
  "Card",
  "Feature",
  "CTA",
  "Navbar",
  "Footer",
  "CmsList"
]);

export type ComponentType = z.infer<typeof componentTypeSchema>;

const responsiveStylesSchema = z.object({
  desktop: z.record(z.string(), z.any()).optional(),
  tablet: z.record(z.string(), z.any()).optional(),
  mobile: z.record(z.string(), z.any()).optional(),
});

export const builderNodeSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string(),
  type: componentTypeSchema,
  props: z.record(z.string(), z.any()).default({}),
  styles: responsiveStylesSchema.optional(),
  children: z.array(builderNodeSchema).default([]),
}));

export const builderDocumentSchema = z.object({
  version: z.number().default(1),
  root: builderNodeSchema,
});

export type BuilderNode = z.infer<typeof builderNodeSchema>;
export type BuilderDocument = z.infer<typeof builderDocumentSchema>;
