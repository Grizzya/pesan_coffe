export const runtime = "nodejs";

import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, items } = body;

    if (!email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }

    // hitung total harga
    const total = items.reduce(
      (sum: number, it: any) =>
        sum + Number(it.price) * Number(it.qty ?? 1),
      0
    );

    // simpan transaksi (BELUM PAID)
    const tx = await prisma.transactions.create({
      data: {
        nama_pelanggan: name,
        email,
        total_harga: total,
        source: "web",
        transaction_details: {
          create: items.map((it: any) => ({
            menu_id: Number(it.menu_id),
            jumlah: Number(it.qty ?? 1),
            sub_total: Number(it.price) * Number(it.qty ?? 1),
          })),
        },
      },
    });

    // buat order_id dari id_transaksi
    const orderId = `ORDER-${tx.id_transaksi}`;

    await prisma.transactions.update({
      where: { id_transaksi: tx.id_transaksi },
      data: { order_id: orderId },
    });

    // kirim ke Midtrans
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
    });

    const midtransTx = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
      customer_details: {
        first_name: name ?? "Guest",
        email,
      },
      item_details: items.map((it: any) => ({
        id: String(it.menu_id),
        price: Number(it.price),
        quantity: Number(it.qty ?? 1),
        name: it.name,
      })),
    });

    return NextResponse.json({
      token: midtransTx.token,
      order_id: orderId,
    });

  } catch (err) {
    console.error("[CREATE ERROR]", err);
    return NextResponse.json(
      { error: "Midtrans/create error" },
      { status: 500 }
    );
  }
}
