export const runtime = "nodejs";

import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import prisma from "@/lib/prisma"; // pastikan path sesuai

type ItemInput = {
  product_id?: number | string | null;
  name?: string;
  qty?: number | string;
  price?: number | string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[CREATE] raw body:", body);

    const { name, email, items, userId } = body as { name?: string; email?: string; items?: ItemInput[]; userId?: number | null };

    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "items required" }, { status: 400 });

    // Normalize items: coerce strings to numbers, accept quantity field variants
    const normalized = items.map((it, idx) => {
      const rawQty = (it as any).qty ?? (it as any).quantity ?? 1;
      const rawPrice = (it as any).price ?? (it as any).unit_price ?? 0;

      const qty = Number(rawQty);
      const price = Number(rawPrice);
      const nameStr = (it.name ?? `item-${idx}`).toString();

      return {
        original: it,
        product_id: it.product_id ?? null,
        name: nameStr,
        qty,
        price,
        subtotal: qty * price,
      };
    });

    // Validate normalized items
    for (const it of normalized) {
      if (!Number.isFinite(it.qty) || !Number.isInteger(it.qty) || it.qty <= 0) {
        return NextResponse.json({ error: "invalid qty", item: it.original ?? it }, { status: 400 });
      }
      if (!Number.isFinite(it.price) || it.price < 0) {
        return NextResponse.json({ error: "invalid price", item: it.original ?? it }, { status: 400 });
      }
    }

    const total = normalized.reduce((s, it) => s + it.subtotal, 0);
    console.log("[CREATE] total:", total);

    const orderId = `ORDER-${Date.now()}`;

    // Save transaction and details to DB
    const tx = await prisma.transactions.create({
      data: {
        order_id: orderId,
        user_id: userId ?? null,
        email,
        total_amount: total,
        status: "pending",
        source: "web",
        transaction_details: {
          create: normalized.map((it) => ({
            product_id: it.product_id ? Number(it.product_id) : null,
            product_name: it.name,
            qty: it.qty,
            price: it.price,
            subtotal: it.subtotal,
          })),
        },
      },
      include: { transaction_details: true },
    });

    console.log("[CREATE] saved tx:", tx.order_id);

    // Prepare Midtrans item_details
    const item_details = normalized.map((it, i) => ({
      id: it.product_id ? String(it.product_id) : `item-${i}`,
      price: it.price,
      quantity: it.qty,
      name: it.name,
    }));

    const parameter = {
      transaction_details: { order_id: orderId, gross_amount: total },
      customer_details: { first_name: name ?? "Guest", email },
      item_details,
    };

    console.log("[CREATE] midtrans parameter:", parameter);

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY ?? "",
      clientKey: process.env.MIDTRANS_CLIENT_KEY ?? "",
    });

    const transaction = await snap.createTransaction(parameter);
    console.log("[CREATE] midtrans response:", transaction);

    return NextResponse.json({
      order_id: orderId,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (err: any) {
    console.error("[CREATE][ERR]", err);
    return NextResponse.json({ error: "Midtrans/create error", detail: String(err) }, { status: 500 });
  }
}



// import { NextResponse } from "next/server";
// import midtransClient from "midtrans-client";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const snap = new midtransClient.Snap({
//       isProduction: false,
//       serverKey: process.env.MIDTRANS_SERVER_KEY!,
//       clientKey: process.env.MIDTRANS_CLIENT_KEY!,
//     });

//     const parameter = {
//       transaction_details: {
//         order_id: `ORDER-${Date.now()}`,
//         gross_amount: body.total,
//       },
//       customer_details: {
//         first_name: body.name,
//         email: body.email,
//       },
//       item_details: body.items,
//     };

//     const transaction = await snap.createTransaction(parameter);

//     return NextResponse.json({
//       token: transaction.token,
//       redirect_url: transaction.redirect_url,
//     });

//   } catch (error) {
//     console.error("Error Midtrans:", error);
//     return NextResponse.json({ error: "Midtrans error" }, { status: 500 });
//   }
// }