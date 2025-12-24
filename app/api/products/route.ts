import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let sql = `
      SELECT 
        m.id_menu   AS id,
        m.nama_menu AS title,
        m.harga     AS price,
        m.gambar    AS image
      FROM menus m
    `;
    const params: any[] = [];

    if (category && category.trim() !== "") {
      sql += `
        JOIN categories c ON c.id_kategori = m.category_id
        WHERE c.nama_kategori = ?
          AND m.is_available = 1
      `;
      params.push(category);
    } else {
      sql += `
        WHERE m.is_available = 1
      `;
    }

    const [rows] = await db.query(sql, params);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("ERROR /api/products:", error);
    return NextResponse.json(
      { message: "Server error", detail: error?.message },
      { status: 500 }
    );
  }
}
