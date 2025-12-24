export const runtime = "nodejs";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // DESTRUCTURE DULU
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
    } = body;

    // BARU BOLEH DIPAKAI
    console.log("MIDTRANS STATUS:", transaction_status);
    console.log("ORDER ID:", order_id);

    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (expectedSignature !== signature_key) {
      return NextResponse.json(
        { message: "invalid signature" },
        { status: 403 }
      );
    }

    let statusDB: "pending" | "success" | "failed" = "pending";

    if (transaction_status === "settlement" || transaction_status === "capture") {
      statusDB = "success";
    } else if (
      transaction_status === "expire" ||
      transaction_status === "cancel" ||
      transaction_status === "deny"
    ) {
      statusDB = "failed";
    }

    await prisma.transactions.update({
      where: { order_id },
      data: {
        status:
          transaction_status === "settlement" ||
          transaction_status === "capture"
            ? "success"
            : transaction_status === "expire" ||
              transaction_status === "cancel" ||
              transaction_status === "deny"
            ? "failed"
            : "pending",

        metode_pembayaran: payment_type ?? null,
      },
    });


    console.log(`ORDER ${order_id} → ${statusDB}`);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[MIDTRANS NOTIFICATION ERROR]", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
