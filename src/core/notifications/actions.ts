"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/core/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getMyNotifications() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return notifications;
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: "Unauthorized" };

  const updated = await prisma.notification.updateMany({
    where: { 
      id: notificationId,
      userId: session.user.id, // Security: Only mark own notifications as read
    },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");
  return { success: true, updated };
}

export async function createSystemNotification(userId: string, title: string, message: string, type: string = "INFO") {
  // Internal server action to create a notification. Should only be called by backend logic.
  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    }
  });

  return notification;
}
