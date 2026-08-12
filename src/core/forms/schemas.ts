import { z } from "zod";

export const formFieldTypeSchema = z.enum([
  "text", "textarea", "email", "phone", "number", 
  "select", "radio", "checkbox", "date", "file"
]);

export const formFieldSchema = z.object({
  id: z.string(), // The key in the submission payload
  label: z.string().min(1, "Label is required"),
  type: formFieldTypeSchema,
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // For select, radio, checkbox
});

export type FormFieldInput = z.infer<typeof formFieldSchema>;

export const formSettingsSchema = z.object({
  successPageUrl: z.string().optional(), // Where to redirect after submission
  notificationEmails: z.array(z.string().email()).default([]), // Who to notify
  captchaEnabled: z.boolean().default(false),
});

export type FormSettingsInput = z.infer<typeof formSettingsSchema>;

export const createFormSchema = z.object({
  name: z.string().min(1, "Form name is required"),
  fields: z.array(formFieldSchema).min(1, "At least one field is required"),
  settings: formSettingsSchema.default({ notificationEmails: [], captchaEnabled: false }),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;

export const submitFormSchema = z.object({
  formId: z.string().uuid(),
  data: z.record(z.string(), z.any()), // The dynamic payload
});
