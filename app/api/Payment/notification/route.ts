export const runtime = "nodejs";
import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, any>;

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
    } = body;

    // Validasi signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (expectedSignature !== signature_key) {
      return NextResponse.json({ message: "invalid signature" }, { status: 403 });
    }

    // HANYA UPDATE JIKA SUKSES
    if (transaction_status === "settlement" || transaction_status === "capture") {
      await prisma.transactions.updateMany({
        where: { order_id },
        data: {
          metode_pembayaran: payment_type,
        },
      });

      console.log(` ORDER ${order_id} PAID via ${payment_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[MIDTRANS NOTIFICATION ERROR]", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
