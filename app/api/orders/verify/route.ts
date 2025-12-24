import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json({ error: "Invalid" }, { status: 400 });
    }

    const tx = await prisma.transactions.findUnique({
      where: { order_id },
      select: { status: true },
    });

    if (!tx || tx.status !== "success") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ status: "success" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
