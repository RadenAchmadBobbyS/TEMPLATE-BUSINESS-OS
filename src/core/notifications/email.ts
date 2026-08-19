import { Resend } from "resend";

// We provide a dummy "re_" string if missing so the Next.js build doesn't crash at module evaluation.
// The actual send function will block sending if the real key is missing.
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy12345");

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendTransactionalEmail(options: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "BusinessOS <noreply@businessos.example.com>",
      to: options.to,
      subject: options.subject,
      text: options.text || "",
      html: options.html || options.text || "",
    });

    if (error) {
      console.error("[Email Service] Resend API Error:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("[Email Service] Failed to send email:", error);
    throw error;
  }
}
