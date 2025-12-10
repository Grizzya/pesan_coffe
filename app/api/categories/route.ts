// app/api/categories/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT id_kategori AS id, nama_kategori AS name
       FROM categories
       ORDER BY nama_kategori ASC`
    );
    return NextResponse.json({ ok: true, data: rows });
  } catch (error: any) {
    console.error("ERROR /api/categories:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mengambil kategori", detail: error?.message },
      { status: 500 }
    );
  }
}
