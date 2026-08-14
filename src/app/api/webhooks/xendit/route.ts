import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { xenditProvider } from "@/core/billing/providers/xendit";
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

  const signature = req.headers.get("x-callback-token") || "";
  const secret = process.env.XENDIT_WEBHOOK_TOKEN || "";
  
  if (!xenditProvider.verifyWebhookSignature(payload, signature, secret)) {
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Xendit might send "event" (for recurring) or just the object (for invoice)
  const eventId = event.id || event.event_id;
  
  if (!eventId) return NextResponse.json({ success: false, error: "Missing event ID" }, { status: 400 });

  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { eventId },
  });

  if (existingEvent) {
    console.log(`[Webhook] Xendit Event ${eventId} already processed. Skipping.`);
    return NextResponse.json({ success: true, received: true, skipped: true });
  }

  // Determine event type
  const eventType = event.event || event.status || "UNKNOWN";

  await prisma.webhookEvent.create({
    data: {
      provider: "XENDIT",
      eventId,
      eventType,
      status: "PROCESSED",
    }
  });

  try {
    // 1. Recurring Payment Webhooks
    if (eventType === "recurring.payment.succeeded" || eventType === "recurring.plan.activated") {
      const data = event.data || event;
      const customerId = data.customer_id;
      const planId = data.recurring_plan_id || data.reference_id;
      
      // We parse the tier from the plan reference (e.g., plan-PRO-12345)
      let tierMatch = planId?.match(/plan-([^-]+)/);
      let tier = tierMatch ? tierMatch[1] : null;

      if (customerId && tier) {
        await prisma.subscription.upsert({
          where: { userId: customerId },
          create: {
            userId: customerId,
            gatewaySubId: planId,
            planTier: tier as SubscriptionTier,
            status: "ACTIVE",
            gateway: "XENDIT",
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          update: {
            gatewaySubId: planId,
            planTier: tier as SubscriptionTier,
            status: "ACTIVE",
            gateway: "XENDIT",
            cancelAtPeriodEnd: false,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        });

        await dispatchNotification({
          userId: customerId,
          type: NotificationTypes.SUBSCRIPTION_CREATED,
          title: "Subscription Activated",
          message: `Your account has successfully upgraded to the ${tier} plan via Xendit.`,
          actionUrl: "/dashboard/billing",
          actionText: "View Billing",
        });
      }
    } 
    else if (eventType === "recurring.payment.failed" || eventType === "recurring.plan.inactivated") {
      const data = event.data || event;
      const customerId = data.customer_id;

      if (customerId) {
        const sub = await prisma.subscription.update({
          where: { userId: customerId },
          data: { status: "PAST_DUE" }
        });

        await dispatchNotification({
          userId: sub.userId,
          type: NotificationTypes.PAYMENT_FAILED,
          title: "Payment Failed",
          message: `We couldn't process your payment via Xendit. Your subscription is now PAST_DUE.`,
          actionUrl: "/dashboard/billing",
          actionText: "Update Payment Method",
        });
      }
    }
    // 2. Fallback Invoice Webhooks
    else if (eventType === "PAID" || eventType === "SETTLED") {
      const external_id = event.external_id;
      const userId = external_id?.split('-')[1];

      const description = event.description || "";
      const tierMatch = description.match(/Subscription to (.*)/);
      const tier = tierMatch ? tierMatch[1] : null;

      if (userId && tier) {
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            gatewaySubId: external_id,
            planTier: tier as SubscriptionTier,
            status: "ACTIVE",
            gateway: "XENDIT",
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          update: {
            gatewaySubId: external_id,
            planTier: tier as SubscriptionTier,
            status: "ACTIVE",
            gateway: "XENDIT",
            cancelAtPeriodEnd: true, // Fallback invoice is manual renewal, so treat it as won't auto-renew
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        });

        await dispatchNotification({
          userId,
          type: NotificationTypes.SUBSCRIPTION_CREATED,
          title: "Subscription Activated",
          message: `Your account has successfully upgraded to the ${tier} plan via Xendit.`,
          actionUrl: "/dashboard/billing",
          actionText: "View Billing",
        });
      }
    } 
    else if (eventType === "EXPIRED" || eventType === "FAILED") {
      const external_id = event.external_id;
      const userId = external_id?.split('-')[1];

      if (userId) {
        await prisma.subscription.update({
          where: { userId },
          data: { status: "PAST_DUE" }
        });
      }
    }
  } catch (error: any) {
    console.error(`[Webhook] Error processing Xendit event ${eventId}:`, error);
    await prisma.webhookEvent.update({
      where: { eventId },
      data: { status: "FAILED" }
    });
    return NextResponse.json({ success: false, error: error.message || "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, received: true });
}
