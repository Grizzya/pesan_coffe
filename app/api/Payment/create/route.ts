import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { prisma } from "@/lib/prisma";
import { paymentSchema } from "@/lib/validation/payment";
import { rateLimit } from "@/lib/rateLimit.ts";
import { errorResponse } from "@/lib/errorResponse";

// MIDTRANS INIT
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

function buildItemName(
  menuName: string,
  catatan?: string | null
) {
  if (!catatan || catatan.trim() === "") {
    return menuName;
  }

  return `${menuName} - ${catatan}`;
}

export async function POST(request: Request) {
  try {
    // RATE LIMIT
    const ip =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "local";

    if (!rateLimit(`payment:${ip}`, 20, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan" },
        { status: 429 }
      );
    }

    // VALIDASI PAYLOAD
    const body = await request.json();
    const parsed = paymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Payload tidak valid", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { nama_pelanggan, email, items } = parsed.data;

    // VALIDASI MENU
    const menuIds = items.map((i) => BigInt(i.menu_id));

    const menus = await prisma.menus.findMany({
      where: {
        id_menu: { in: menuIds },
        is_available: true,
      },
      select: {
        id_menu: true,
        harga: true,
        nama_menu: true,
      },
    });

    const menuMap = new Map<
      bigint,
      { harga: number; nama: string }
    >(menus.map((m) => [m.id_menu, { harga: m.harga, nama: m.nama_menu }]));

    let gross_amount = 0;

    for (const item of items) {
      const menu = menuMap.get(BigInt(item.menu_id));

      if (!menu) {
        return NextResponse.json(
          { error: `Menu ID ${item.menu_id} tidak tersedia` },
          { status: 400 }
        );
      }

      const expectedSubtotal = menu.harga * item.jumlah;

      if (expectedSubtotal !== item.sub_total) {
        return NextResponse.json(
          { error: "Harga tidak valid" },
          { status: 400 }
        );
      }

      gross_amount += expectedSubtotal;
    }

    // ITEM DETAILS (MIDTRANS)
    const item_details = items.map((item) => {
      const menu = menuMap.get(BigInt(item.menu_id))!;
      return {
        id: item.menu_id.toString(),
        name: buildItemName(menu.nama, item.catatan),
        price: menu.harga,
        quantity: item.jumlah,
      };
    });

    // ORDER ID
    const order_id = `ORDER-${Date.now()}`;

    // SIMPAN TRANSAKSI
    const transactionDB = await prisma.transactions.create({
      data: {
        order_id,
        nama_pelanggan,
        email,
        total_harga: gross_amount,
        sumber: "web",
        status: "pending",
      },
    });

    await prisma.transaction_details.createMany({
      data: items.map((item) => ({
        transaction_id: transactionDB.id_transaksi,
        menu_id: item.menu_id,
        jumlah: item.jumlah,
        sub_total: item.sub_total,
        catatan: item.catatan ?? null,
      })),
    });

    // MIDTRANS
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id,
        gross_amount,
      },
      item_details,
      customer_details: {
        first_name: nama_pelanggan,
        email,
      },
    });

    await prisma.transactions.update({
      where: { id_transaksi: transactionDB.id_transaksi },
      data: { snap_token: transaction.token },
    });

    return NextResponse.json({
      token: transaction.token,
      order_id,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
