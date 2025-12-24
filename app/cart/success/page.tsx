"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Saya tambahkan 'FileText' untuk ikon riwayat agar lebih cantik
import { CheckCircle, Loader2, ShoppingBag, FileText } from "lucide-react"; 
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Simulasi loading 1.5 detik
    const timer = setTimeout(() => {
        setLoading(false);
        setIsValid(true); 
    }, 1500);

    // --- LOGIKA VERIFIKASI ASLI (Uncomment jika sudah siap) ---
    const orderId = sessionStorage.getItem("last_order_id");
    if (!orderId) { router.replace("/"); return; }

    fetch(`/api/orders/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid");
        return res.json();
      })
      .then((data) => {
        if (data.status !== "success") throw new Error("Not paid");
        sessionStorage.removeItem("last_order_id");
        setIsValid(true);
        setLoading(false);
      })
      .catch(() => { router.replace("/"); });


    return () => clearTimeout(timer);
  }, [router]);

  // --- TAMPILAN LOADING (RESPONSIF) ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-[#39804D] mb-4 md:mb-6" />
            <p className="text-[#2D2C2C] font-semibold text-lg md:text-xl tracking-wide">Memverifikasi pesanan...</p>
        </div>
      </div>
    );
  }

  // --- TAMPILAN SUKSES (RESPONSIF PC & MOBILE) ---
  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4 md:p-8">
      
      {/* Container Kartu Utama */}
      <div 
        className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 w-full max-w-md md:max-w-lg lg:max-w-xl text-center relative overflow-hidden transition-all duration-500 ease-in-out"
        style={{ borderTop: "8px solid #39804D" }}
      >
        {/* Dekorasi Latar (Blur) */}
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 md:w-48 md:h-48 bg-[#D3FFDE] rounded-full opacity-50 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 md:w-48 md:h-48 bg-[#D3FFDE] rounded-full opacity-50 blur-3xl pointer-events-none"></div>

        {/* Ikon Sukses */}
        <div className="flex justify-center mb-6 md:mb-8 mt-2">
          <div className="relative group">
            {/* Efek Ping di belakang ikon */}
            <div className="absolute inset-0 bg-[#D3FFDE] rounded-full scale-150 animate-ping opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="bg-[#D3FFDE] rounded-full p-4 md:p-6 relative z-10 shadow-sm">
              <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-[#39804D]" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Judul Besar Responsif */}
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#39804D] mb-4 tracking-tight">
          Pembayaran Berhasil!
        </h1>
        
        {/* Deskripsi Responsif */}
        <p className="text-[#2D2C2C] text-opacity-80 mb-8 md:mb-10 text-base md:text-lg leading-relaxed px-2 md:px-8">
          Terima kasih! Pesanan kamu sudah kami terima dan sedang disiapkan dengan penuh cinta oleh barista kami.
        </p>

        {/* Kotak Detail Ringkas */}
        <div className="bg-[#F5FBF7] rounded-xl p-5 md:p-6 mb-8 md:mb-10 border border-[#D3FFDE] flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
            {/* Kiri: Status */}
            <div className="text-center md:text-left">
              <p className="text-sm text-[#2D2C2C] opacity-70 mb-1 font-medium">Status Pembayaran</p>
              <p className="text-xl md:text-2xl font-bold text-[#39804D] tracking-wide">LUNAS ✅</p>
            </div>
            
            {/* Garis Pembatas (Hanya muncul di PC/md ke atas) */}
            <div className="h-px w-full md:h-10 md:w-px bg-[#D3FFDE] hidden md:block"></div>
            
            {/* Kanan: Metode (Opsional) */}
            <div className="text-center md:text-right">
              <p className="text-sm text-[#2D2C2C] opacity-70 mb-1 font-medium">Metode</p>
              <p className="text-lg font-bold text-[#2D2C2C]">Midtrans (QRIS)</p>
            </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col gap-4 md:gap-5">
          <Link href="/" className="w-full">
            <button className="w-full bg-[#39804D] hover:bg-[#2f6a3f] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:shadow-lg flex items-center justify-center gap-3 text-base md:text-lg">
              <ShoppingBag size={22} strokeWidth={2.5} />
              Kembali Belanja
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}