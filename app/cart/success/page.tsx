"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("order_id");

  return (
    <div style={{ padding: 32 }}>
      <h1>Pembayaran Berhasil 🎉</h1>
      <p>Order ID: <b>{orderId}</b></p>

      <Link href="/">Kembali ke Beranda</Link>
    </div>
  );
}
