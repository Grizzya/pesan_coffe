import { db } from "@/lib/db"; 
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = "SELECT * FROM products";
  const params: string[] = [];

  if (category && category !== "all") { 
    query += " WHERE category = ?";
    params.push(category);
  }

  try {
    const [rows] = await db.query(query, params);
    
    
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}
