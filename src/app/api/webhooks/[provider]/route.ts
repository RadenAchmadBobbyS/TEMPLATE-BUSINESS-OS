import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { stripeProvider } from "@/core/billing/providers/stripe";
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client";
import { dispatchNotification } from "@/core/notifications/dispatcher";
import { NotificationTypes } from "@/core/notifications/types";

function mapStripeStatusToBusinessOS(status: string): SubscriptionStatus {
  switch (status) {
    case "active": return "ACTIVE";
    case "past_due": return "PAST_DUE";
    case "trialing": return "TRIALING";
    case "canceled": return "CANCELED";
    case "unpaid": return "UNPAID"; // Assuming we added UNPAID in schema, else EXPIRED
    case "paused": return "PAUSED";
    default: return "ACTIVE";
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const resolvedParams = await params;
  const provider = resolvedParams.provider.toUpperCase();
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || req.headers.get("x-callback-token") || "";

  // 1. Verify Signature
  if (provider === "STRIPE") {
    // In production, we MUST verify signature
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (secret) {
      const isValid = stripeProvider.verifyWebhookSignature(payload, signature, secret);
      if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    } else {
      console.warn("[Webhook] STRIPE_WEBHOOK_SECRET is not set, skipping signature verification in dev.");
    }
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventId = event.id;
  if (!eventId) return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
  
  const eventType = event.type;

  // 2. Idempotency Check
  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { eventId },
  });

  if (existingEvent) {
    console.log(`[Webhook] Event ${eventId} already processed. Skipping.`);
    return NextResponse.json({ received: true, skipped: true });
  }

  // Record the event immediately for idempotency
  await prisma.webhookEvent.create({
    data: {
      provider,
      eventId,
      eventType,
      status: "PROCESSED",
    }
  });

  try {
    // 3. Process the event based on its type
    switch (eventType) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const workspaceId = session.metadata?.workspaceId;
        const tier = session.metadata?.tier as SubscriptionTier;
        const subId = session.subscription;
        const customerId = session.customer;

        if (workspaceId && subId) {
          await prisma.subscription.update({
            where: { workspaceId },
            data: {
              gatewaySubId: subId,
              planTier: tier,
              status: "ACTIVE",
              gateway: "STRIPE",
            }
          });

          // Notification: Subscription Created / Upgraded
          // Find the owner of the workspace to notify
          const ownerRole = await prisma.userRole.findFirst({
            where: { workspaceId, role: "OWNER" }
          });
          
          if (ownerRole) {
            await dispatchNotification({
              userId: ownerRole.userId,
              workspaceId,
              type: NotificationTypes.SUBSCRIPTION_CREATED,
              title: "Subscription Activated",
              message: `Your workspace has successfully upgraded to the ${tier} plan.`,
              actionUrl: "/dashboard/billing",
              actionText: "View Billing",
            });
          }
        }
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const subId = subscription.id;
        const status = mapStripeStatusToBusinessOS(subscription.status);
        const cancelAtPeriodEnd = subscription.cancel_at_period_end;
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

        const updatedSub = await prisma.subscription.update({
          where: { gatewaySubId: subId },
          data: {
            status,
            cancelAtPeriodEnd,
            currentPeriodEnd,
          },
          include: { workspace: true }
        });

        if (updatedSub && updatedSub.workspace) {
          const ownerRole = await prisma.userRole.findFirst({
            where: { workspaceId: updatedSub.workspaceId, role: "OWNER" }
          });
          
          if (ownerRole) {
            if (cancelAtPeriodEnd) {
              await dispatchNotification({
                userId: ownerRole.userId,
                workspaceId: updatedSub.workspaceId,
                type: NotificationTypes.SUBSCRIPTION_CANCELED,
                title: "Subscription Canceling",
                message: `Your ${updatedSub.planTier} subscription will cancel at the end of the billing period.`,
              });
            } else {
              await dispatchNotification({
                userId: ownerRole.userId,
                workspaceId: updatedSub.workspaceId,
                type: NotificationTypes.SUBSCRIPTION_UPDATED,
                title: "Subscription Updated",
                message: `Your subscription status is now ${status}.`,
                sendEmail: false, // Too noisy to email on every update
              });
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const subId = subscription.id;

        await prisma.subscription.update({
          where: { gatewaySubId: subId },
          data: { status: "CANCELED" }
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subId = invoice.subscription;
        if (subId) {
          const sub = await prisma.subscription.update({
            where: { gatewaySubId: subId },
            data: { status: "ACTIVE" }
          });
          
          const ownerRole = await prisma.userRole.findFirst({
            where: { workspaceId: sub.workspaceId, role: "OWNER" }
          });

          if (ownerRole) {
            await dispatchNotification({
              userId: ownerRole.userId,
              workspaceId: sub.workspaceId,
              type: NotificationTypes.PAYMENT_SUCCESS,
              title: "Payment Successful",
              message: `We successfully processed your payment of ${(invoice.amount_paid / 100).toFixed(2)} ${invoice.currency.toUpperCase()}.`,
              actionUrl: "/dashboard/billing",
              actionText: "View Invoice",
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subId = invoice.subscription;
        if (subId) {
          const sub = await prisma.subscription.update({
            where: { gatewaySubId: subId },
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
              message: `We couldn't process your payment. Your subscription is now PAST_DUE. Please update your payment method.`,
              actionUrl: "/dashboard/billing",
              actionText: "Update Payment Method",
            });
          }
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error(`[Webhook] Error processing event ${eventId}:`, error);
    await prisma.webhookEvent.update({
      where: { eventId },
      data: { status: "FAILED" }
    });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
