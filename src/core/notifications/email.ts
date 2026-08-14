import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_123");

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendTransactionalEmail(options: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email Service] MOCK SEND to", options.to, ":", options.subject);
    return { id: `mock_email_${Date.now()}` };
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
