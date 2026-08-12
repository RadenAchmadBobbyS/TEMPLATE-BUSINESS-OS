import { prisma } from "@/shared/lib/prisma";
import { NotificationType, NotificationCategoryMap } from "./types";
import { sendTransactionalEmail } from "./email";
import { buildEmailTemplate } from "./templates";

export interface DispatchNotificationParams {
  userId: string;
  workspaceId?: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: any;
  actionUrl?: string;
  actionText?: string;
  sendEmail?: boolean; // Set to false to force skipping email
}

export async function dispatchNotification(params: DispatchNotificationParams) {
  // 1. Create In-App Notification (Always)
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId,
      workspaceId: params.workspaceId,
      type: params.type,
      title: params.title,
      message: params.message,
      metadata: params.metadata || {},
      actionUrl: params.actionUrl,
    }
  });

  // 2. Check Preferences if Email is requested
  if (params.sendEmail !== false) {
    try {
      // Fetch user to get email address
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
        include: { notificationPreference: true }
      });

      if (user && user.email) {
        // Determine category for preference check
        const category = NotificationCategoryMap[params.type];
        
        let shouldSend = true;
        
        // If preference exists, check it
        if (user.notificationPreference) {
          const pref = user.notificationPreference;
          
          if (category === "SYSTEM" && !pref.system) shouldSend = false;
          if (category === "BILLING" && !pref.billing) shouldSend = false;
          if (category === "SECURITY" && !pref.security) shouldSend = false;
          if (category === "WORKSPACE" && !pref.workspace) shouldSend = false;
          if (category === "WEBSITE" && !pref.website) shouldSend = false;
        }

        if (shouldSend) {
          const htmlContent = buildEmailTemplate({
            title: params.title,
            message: params.message,
            actionUrl: params.actionUrl,
            actionText: params.actionText,
          });

          await sendTransactionalEmail({
            to: user.email,
            subject: params.title,
            html: htmlContent,
            text: params.message,
          });
        }
      }
    } catch (err) {
      // Log email failure but DO NOT throw. 
      // The core business transaction must remain intact even if notification email fails.
      console.error(`[Dispatcher] Failed to send email for notification ${notification.id}:`, err);
    }
  }

  return notification;
}
