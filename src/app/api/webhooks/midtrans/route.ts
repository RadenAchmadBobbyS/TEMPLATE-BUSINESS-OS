import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // MOCK: Midtrans signature validation would go here
    // Verify signature using Midtrans server key

    const { order_id, transaction_status, gross_amount } = payload;
    
    // In our system, order_id maps to gatewayTxId or gatewayInvoiceId.
    const transaction = await prisma.transaction.findUnique({
      where: { gatewayTxId: order_id }
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    let status = "PENDING";
    if (transaction_status === "settlement" || transaction_status === "capture") {
      status = "SUCCESS";
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      status = "FAILED";
    } else if (transaction_status === "refund") {
      status = "REFUNDED";
    }

    // Update Transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status }
    });

    // Sync Invoice status
    let invoiceStatus = "OPEN";
    if (status === "SUCCESS") invoiceStatus = "PAID";
    else if (status === "FAILED") invoiceStatus = "FAILED";
    else if (status === "REFUNDED") invoiceStatus = "REFUNDED";

    await prisma.invoice.update({
      where: { id: transaction.invoiceId },
      data: { status: invoiceStatus }
    });

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Midtrans Webhook Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
