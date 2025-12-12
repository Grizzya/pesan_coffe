export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[MIDTRANS NOTIF] payload:", body);

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key: incomingSignature,
      transaction_status,
      payment_type,
      fraud_status,
    } = body as Record<string, any>;

    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY tidak diset di env");
      return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
    }

    const expected = crypto
      .createHash("sha512")
      .update(String(order_id) + String(status_code) + String(gross_amount) + serverKey)
      .digest("hex");

    if (expected !== incomingSignature) {
      console.warn("[MIDTRANS NOTIF] invalid signature", { expected, incomingSignature });
      return NextResponse.json({ message: "invalid signature" }, { status: 403 });
    }

    if (transaction_status === "settlement" || transaction_status === "capture") {
      // TODO: update database order dengan order_id -> set status "paid"
      console.log(`[MIDTRANS NOTIF] order ${order_id} paid. payment_type=${payment_type}, fraud=${fraud_status}`);
    } else {
      console.log(`[MIDTRANS NOTIF] order ${order_id} status ${transaction_status}`);
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    console.error("[MIDTRANS NOTIF] error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
