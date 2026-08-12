import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { xenditProvider } from "@/core/billing/providers/xendit";
import { SubscriptionTier } from "@prisma/client";
import { dispatchNotification } from "@/core/notifications/dispatcher";
import { NotificationTypes } from "@/core/notifications/types";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("x-callback-token") || "";
  const secret = process.env.XENDIT_WEBHOOK_TOKEN || "";
  
  if (!xenditProvider.verifyWebhookSignature(payload, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Xendit Invoice webhook structure
  const { id: eventId, external_id, status, amount } = event;
  
  if (!eventId || !external_id) return NextResponse.json({ error: "Missing event ID or external_id" }, { status: 400 });

  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { eventId },
  });

  if (existingEvent) {
    console.log(`[Webhook] Xendit Event ${eventId} already processed. Skipping.`);
    return NextResponse.json({ received: true, skipped: true });
  }

  await prisma.webhookEvent.create({
    data: {
      provider: "XENDIT",
      eventId,
      eventType: status,
      status: "PROCESSED",
    }
  });

  try {
    // external_id is format inv-{workspaceId}-{timestamp}
    const workspaceId = external_id.split('-')[1];

    if (status === "PAID" || status === "SETTLED") {
      if (workspaceId) {
        // Need to figure out the tier based on the amount or custom field. 
        // We can parse the description if we included it, or use amount mapping.
        // Let's use the description mapping for simplicity: `Subscription to ${tier}`
        const description = event.description || "";
        const tierMatch = description.match(/Subscription to (.*)/);
        const tier = tierMatch ? tierMatch[1] : null;

        if (tier) {
          const sub = await prisma.subscription.update({
            where: { workspaceId },
            data: {
              gatewaySubId: external_id,
              planTier: tier as SubscriptionTier,
              status: "ACTIVE",
              gateway: "XENDIT",
            }
          });

          const ownerRole = await prisma.userRole.findFirst({
            where: { workspaceId, role: "OWNER" }
          });
          
          if (ownerRole) {
            await dispatchNotification({
              userId: ownerRole.userId,
              workspaceId,
              type: NotificationTypes.SUBSCRIPTION_CREATED,
              title: "Subscription Activated",
              message: `Your workspace has successfully upgraded to the ${tier} plan via Xendit.`,
              actionUrl: "/dashboard/billing",
              actionText: "View Billing",
            });
          }
        }
      }
    } else if (status === "EXPIRED" || status === "FAILED") {
      if (workspaceId) {
        const sub = await prisma.subscription.update({
          where: { workspaceId },
          data: { status: "PAST_DUE" }
        });

        const ownerRole = await prisma.userRole.findFirst({
          where: { workspaceId: sub.workspaceId, role: "OWNER" }
        });

        if (ownerRole) {
          await dispatchNotification({
            userId: ownerRole.userId,
            workspaceId: sub.workspaceId,
            type: NotificationTypes.PAYMENT_FAILED,
            title: "Payment Failed",
            message: `We couldn't process your payment via Xendit. Your subscription is now PAST_DUE.`,
            actionUrl: "/dashboard/billing",
            actionText: "Update Payment Method",
          });
        }
      }
    }
  } catch (error) {
    console.error(`[Webhook] Error processing Xendit event ${eventId}:`, error);
    await prisma.webhookEvent.update({
      where: { eventId },
      data: { status: "FAILED" }
    });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
