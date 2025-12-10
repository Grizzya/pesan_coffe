// export const runtime = "nodejs";

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


export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // menerima JSON
    console.log("API /api/payment/create called — body:", JSON.stringify(body));
    return NextResponse.json({
      ok: true,
      message: "route OK",
      received: body
    });
  } catch (err) {
    console.error("route error:", err);
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
