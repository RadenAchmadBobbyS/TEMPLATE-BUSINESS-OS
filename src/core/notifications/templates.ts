import { NotificationType } from "./types";

export interface EmailTemplateData {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

export function buildEmailTemplate(data: EmailTemplateData): string {
  // A clean, simple, reusable HTML email template
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 24px; color: #333;">
      <div style="border-bottom: 1px solid #eaeaea; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #111;">BusinessOS</h2>
      </div>
      <h3 style="margin-top: 0;">${data.title}</h3>
      <p style="line-height: 1.5; color: #555;">${data.message}</p>
      
      ${data.actionUrl ? `
        <div style="margin-top: 32px; text-align: center;">
          <a href="${data.actionUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; display: inline-block;">
            ${data.actionText || 'View Details'}
          </a>
        </div>
      ` : ''}
      
      <div style="margin-top: 48px; font-size: 12px; color: #999; border-top: 1px solid #eaeaea; padding-top: 16px;">
        <p>You received this email because of your notification preferences on BusinessOS.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/notifications" style="color: #666;">Manage your notification preferences</a></p>
      </div>
    </div>
  `;
}
