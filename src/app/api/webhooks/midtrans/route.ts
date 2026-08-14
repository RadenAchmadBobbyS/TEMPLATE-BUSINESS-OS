import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { midtransProvider } from "@/core/billing/providers/midtrans";
import { SubscriptionTier } from "@prisma/client";
import { dispatchNotification } from "@/core/notifications/dispatcher";
import { NotificationTypes } from "@/core/notifications/types";

export async function POST(req: NextRequest) {
  let payload;
  try {
    payload = await req.text();
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to read payload" }, { status: 400 });
  }

  const signature = req.headers.get("x-callback-token") || req.headers.get("x-signature") || "";
  const secret = process.env.MIDTRANS_SERVER_KEY || "";
  
  if (!midtransProvider.verifyWebhookSignature(payload, signature, secret)) {
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { order_id, transaction_status, custom_field1: userId, custom_field2: tier } = event;
  if (!order_id) return NextResponse.json({ success: false, error: "Missing order_id" }, { status: 400 });

  const eventId = `midtrans_${order_id}_${transaction_status}`;

  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { eventId },
  });

  if (existingEvent) {
    console.log(`[Webhook] Midtrans Event ${eventId} already processed. Skipping.`);
    return NextResponse.json({ success: true, received: true, skipped: true });
  }

  await prisma.webhookEvent.create({
    data: {
      provider: "MIDTRANS",
      eventId,
      eventType: transaction_status,
      status: "PROCESSED",
    }
  });

  try {
    if (transaction_status === "settlement" || transaction_status === "capture") {
      if (userId && tier) {
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            gatewaySubId: order_id,
            planTier: tier as SubscriptionTier,
            status: "ACTIVE",
            gateway: "MIDTRANS",
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          update: {
            gatewaySubId: order_id,
            planTier: tier as SubscriptionTier,
            status: "ACTIVE",
            gateway: "MIDTRANS",
            cancelAtPeriodEnd: true, // Snap is manual renewal
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        });

        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
        
        if (user) {
          await dispatchNotification({
            userId,
            type: NotificationTypes.SUBSCRIPTION_CREATED,
            title: "Subscription Activated",
            message: `Your account has successfully upgraded to the ${tier} plan via Midtrans.`,
            actionUrl: "/dashboard/billing",
            actionText: "View Billing",
          });
        }
      }
    } else if (transaction_status === "deny" || transaction_status === "cancel" || transaction_status === "expire") {
      if (userId) {
        const sub = await prisma.subscription.update({
          where: { userId },
          data: { status: "PAST_DUE" }
        });

        await dispatchNotification({
          userId: sub.userId,
          type: NotificationTypes.PAYMENT_FAILED,
          title: "Payment Failed",
          message: `We couldn't process your payment via Midtrans. Your subscription is now PAST_DUE.`,
          actionUrl: "/dashboard/billing",
          actionText: "Update Payment Method",
        });
      }
    }
  } catch (error: any) {
    console.error(`[Webhook] Error processing Midtrans event ${eventId}:`, error);
    await prisma.webhookEvent.update({
      where: { eventId },
      data: { status: "FAILED" }
    });
    return NextResponse.json({ success: false, error: error.message || "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, received: true });
}
