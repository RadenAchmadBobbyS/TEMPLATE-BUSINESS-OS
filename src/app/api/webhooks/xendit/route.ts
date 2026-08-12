import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // MOCK: Xendit callback token validation would go here
    // const xenditToken = req.headers.get("x-callback-token");

    const { id, status, amount } = payload;
    
    // In our system, id maps to gatewayTxId
    const transaction = await prisma.transaction.findUnique({
      where: { gatewayTxId: id }
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    let txStatus = "PENDING";
    if (status === "PAID" || status === "COMPLETED") {
      txStatus = "SUCCESS";
    } else if (status === "EXPIRED" || status === "FAILED") {
      txStatus = "FAILED";
    }

    // Update Transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: txStatus }
    });

    // Sync Invoice status
    let invoiceStatus = "OPEN";
    if (txStatus === "SUCCESS") invoiceStatus = "PAID";
    else if (txStatus === "FAILED") invoiceStatus = "FAILED";

    await prisma.invoice.update({
      where: { id: transaction.invoiceId },
      data: { status: invoiceStatus }
    });

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Xendit Webhook Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
