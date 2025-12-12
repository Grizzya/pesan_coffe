"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import "./cart.css";
import CheckoutModal from "@/components/CheckoutModal";

declare global {
  interface Window {
    snap: any;
  }
}

export default function CartPage() {
  const { cartItems, removeFromCart, totalItems } = useCart();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // customer info akan dikirim dari modal
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const totalPrice = cartItems.reduce((total, item) => {
    const priceAsNumber = Number(item.product.price) || 0;
    const qty = item.quantity ?? 1;
    return total + priceAsNumber * qty;
  }, 0);

  // dipanggil saat modal submit (nama + email)
  const handleCheckoutSubmit = async (details: { name: string; email: string }) => {
    setCustomerName(details.name);
    setCustomerEmail(details.email);
    setIsCheckoutModalOpen(false);

    // langsung panggil payment
    await handlePayment(details.name, details.email);
  };

  // HANDLE PAYMENT
  const handlePayment = async (name: string, email: string) => {
    if (cartItems.length === 0) {
      alert("Keranjang kosong.");
      return;
    }

    setIsProcessing(true);

    try {
      // item list untuk Midtrans
      const itemsForMidtrans = cartItems.map((it) => ({
        id: String(it.product.id),
        price: Number(it.product.price),
        quantity: Number(it.quantity ?? 1),
        name: it.product.title,
      }));

      // Panggil API transaksi Midtrans
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          total: totalPrice,
          items: itemsForMidtrans, 
        }),
      });

      const data = await res.json();

      if (!data || !data.token) {
        console.error("Gagal mendapatkan token dari server:", data);
        alert("Gagal membuat transaksi. Coba lagi.");
        setIsProcessing(false);
        return;
      }

      // Panggil Snap popup
      window.snap.pay(data.token, {
        onSuccess: async function (result: any) {
          console.log("Midtrans success:", result);
          try {
            await fetch("/api/payment/record", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ result, customerName: name, customerEmail: email })
            });
          } catch (e) {
            console.warn("Gagal kirim record ke backend:", e);
          }

          alert("Pembayaran berhasil. Terima kasih!");
          setIsProcessing(false);
          // TODO: kosongkan cart atau redirect ke halaman sukses
        },

        onPending: function (result: any) {
          console.log("Midtrans pending:", result);
          alert("Pembayaran menunggu (pending). Cek email untuk instruksi.");
          setIsProcessing(false);
        },

        onError: function (result: any) {
          console.error("Midtrans error:", result);
          alert("Terjadi kesalahan saat membayar.");
          setIsProcessing(false);
        },

        onClose: function () {
          console.log("User menutup popup tanpa membayar");
          setIsProcessing(false);
        },
      });
    } catch (err) {
      console.error("Error when creating midtrans transaction:", err);
      alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setIsProcessing(false);
    }
  };
  // ====== END HANDLE PAYMENT ======

  return (
    <div className="cart-page-container">
      <nav className="cart-nav">
        <Link href="/"> &larr; Kembali Belanja </Link>
      </nav>

      <main className="cart-main">
        <h1>Keranjang Anda</h1>

        {totalItems === 0 ? (
          <div className="cart-empty">
            <p>Keranjang Anda masih kosong.</p>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <Image
                    src={item.product.image?? "/default.png"}
                    alt={item.product.title}
                    width={80}
                    height={80}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h3>{item.product.title}</h3>
                    <p className="item-options">
                      {item.options?.sugar}, {item.options?.ice}
                    </p>
                    <p className="item-price">
                      Rp {Number(item.product.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button className="item-remove-button" onClick={() => removeFromCart(item.id)}>
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary-box">
              <h2>Ringkasan Pesanan</h2>
              <div className="summary-row">
                <span>Total Harga ({totalItems} item)</span>
                <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="summary-row total">
                <span>Total Keseluruhan</span>
                <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>

              <button
                className="checkout-button-full"
                style={{ marginTop: "16px", width: "100%", cursor: "pointer" }}
                onClick={() => setIsCheckoutModalOpen(true)}
                disabled={isProcessing}
              >
                {isProcessing ? "Memproses..." : "Lanjut ke Pembayaran"}
              </button>
            </div>
          </div>
        )}
      </main>

      {isCheckoutModalOpen && (
        <CheckoutModal onClose={() => setIsCheckoutModalOpen(false)} onSubmit={handleCheckoutSubmit} />
      )}
    </div>
  );
}
