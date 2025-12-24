import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import midtransClient from "midtrans-client";

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
});

export async function POST(request: Request) {
  try {

    //INTERNAL AUTH

    const secret = request.headers.get("x-internal-secret");

    if (secret !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // AMBIL TRANSAKSI PENDING 
    const pendingTx = await prisma.transactions.findMany({
      where: {
        status: "pending",
        order_id: { not: null },
        created_at: {
          lt: new Date(Date.now() - 60 * 60 * 1000),
        },
      },
    });

    for (const tx of pendingTx) {
      const status = await core.transaction.status(tx.order_id!);

      let statusDB: "pending" | "success" | "failed" = "pending";

      if (
        status.transaction_status === "settlement" ||
        status.transaction_status === "capture"
      ) {
        statusDB = "success";
      } else if (
        status.transaction_status === "expire" ||
        status.transaction_status === "cancel" ||
        status.transaction_status === "deny"
      ) {
        statusDB = "failed";
      }

      await prisma.transactions.update({
        where: { id_transaksi: tx.id_transaksi },
        data: { status: statusDB },
      });
    }

    return NextResponse.json({
      checked: pendingTx.length,
    });
  } catch (error) {
    console.error("CHECK STATUS ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
