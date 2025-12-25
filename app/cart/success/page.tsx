"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const orderId = sessionStorage.getItem("last_order_id");
    if (!orderId) {
      router.replace("/");
      return;
    }

    const verifyOrder = async () => {
      try {
        const res = await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId }),
        });

        if (!res.ok) throw new Error("Invalid order");

        const data = await res.json();
        if (data.status !== "success") throw new Error("Not paid");

        sessionStorage.removeItem("last_order_id");
        setIsValid(true);
      } catch {
        router.replace("/");
      } finally {
        setTimeout(() => setLoading(false), 1200);
      }
    };

    verifyOrder();
  }, [router]);

  /* =======================
     LOADING STATE
  ======================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="flex flex-col items-center animate-pulse">
          <Loader2 className="w-14 h-14 animate-spin text-[#39804D] mb-5" />
          <p className="text-[#2D2C2C] font-semibold text-lg tracking-wide">
            Memverifikasi pesanan...
          </p>
        </div>
      </div>
    );
  }

  if (!isValid) return null;

  /* =======================
     SUCCESS PAGE
  ======================= */
  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-[fadeIn_0.6s_ease-out]"
        style={{ borderTop: "8px solid #39804D" }}
      >
        {/* Background Decoration */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#D3FFDE] rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#D3FFDE] rounded-full blur-3xl opacity-50 pointer-events-none" />

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#D3FFDE] scale-150 animate-ping opacity-30" />
            <div className="relative bg-[#D3FFDE] rounded-full p-6 shadow-md">
              <CheckCircle className="w-20 h-20 text-[#39804D]" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#39804D] mb-4">
          Pembayaran Berhasil!
        </h1>

        {/* Description */}
        <p className="text-[#2D2C2C] text-opacity-80 text-base md:text-lg leading-relaxed mb-10 px-2">
          Terima kasih! Pesanan kamu sudah kami terima dan sedang disiapkan oleh
          barista kami ☕
        </p>

        {/* Status Box */}
        <div className="bg-[#F5FBF7] border border-[#D3FFDE] rounded-xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="text-center md:text-left">
            <p className="text-sm opacity-70 mb-1">Status Pembayaran</p>
            <p className="text-2xl font-bold text-[#39804D]">LUNAS</p>
          </div>

          <div className="hidden md:block w-px h-10 bg-[#D3FFDE]" />

          <div className="text-center md:text-right">
            <p className="text-sm opacity-70 mb-1">Metode</p>
            <p className="font-semibold text-[#2D2C2C]">Midtrans (QRIS)</p>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/">
          <button className="w-full bg-[#39804D] hover:bg-[#2f6a3f] text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 text-lg">
            <ShoppingBag size={22} />
            Kembali Belanja
          </button>
        </Link>
      </div>
    </div>
  );
}
