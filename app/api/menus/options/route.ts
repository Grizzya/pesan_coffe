import { NextResponse } from "next/server";
import db from "@/lib/db";


export async function POST(req: Request) {
  try {
    //  request body JSON
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Request body harus JSON" },
        { status: 400 }
      );
    }

    const menu_id = Number(body.menu_id);

    // validasi menu_id
    if (!menu_id || isNaN(menu_id)) {
      return NextResponse.json(
        { message: "menu_id tidak valid" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT 
        mo.id_option,
        mo.nama_opsi,
        mo.pilihan
      FROM menu_menu_option mmo
      JOIN menu_options mo ON mo.id_option = mmo.option_id
      WHERE mmo.menu_id = ?
      `,
      [menu_id]
    );

    //  menu belum punya opsi
    if (!rows || rows.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "Menu tidak memiliki opsi",
      });
    }

    // transform data
    const options = rows.map((row: any) => ({
      id: row.id_option,
      name: row.nama_opsi,
      choices: (() => {
        try {
          const parsed = JSON.parse(row.pilihan);
          return parsed.map((item: any) =>
            typeof item === "string"
              ? { name: item, price: 0 }
              : { name: item.name, price: item.price ?? 0 }
          );
        } catch {
          return [];
        }
      })(),
    }));

    return NextResponse.json({
      success: true,
      data: options,
    });
  } catch (error) {
    console.error("MENU OPTIONS API ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
