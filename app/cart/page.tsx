"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CheckoutModal from "@/components/CheckoutModal";
import "./cart.css";

declare global {
  interface Window {
    snap: any;
  }
}

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, totalItems, clearCart } = useCart();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.product.price) || 0;
    const qty = item.quantity ?? 1;
    return total + price * qty;
  }, 0);

  // submit dari modal
  const handleCheckoutSubmit = async (data: { name: string; email: string }) => {
    setIsCheckoutModalOpen(false);
    await handlePayment(data.name, data.email);
  };

  const handlePayment = async (name: string, email: string) => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      const items = cartItems.map((it) => ({
        menu_id: Number(it.product.id),
        name: it.product.title,
        price: Number(it.product.price),
        qty: Number(it.quantity ?? 1),
      }));

      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, items }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        alert("Gagal membuat transaksi");
        setIsProcessing(false);
        return;
      }

      window.snap.pay(data.token, {
        onSuccess: () => {
          clearCart();
          router.push("/cart/success");
        },
        onPending: () => {
          alert("Pembayaran pending");
          setIsProcessing(false);
        },
        onError: () => {
          alert("Pembayaran gagal");
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-page-container">
      <nav className="cart-nav">
        <Link href="/">← Kembali Belanja</Link>
      </nav>

      <main className="cart-main">
        <h1>Keranjang Anda</h1>

        {totalItems === 0 ? (
          <p>Keranjang kosong</p>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <Image
                    src={item.product.image ?? "/default.png"}
                    alt={item.product.title}
                    width={80}
                    height={80}
                  />
                  <div className="item-details">
                  <h3>{item.product.title}</h3>

                  {/* 🔥 OPSI DI BAWAH NAMA PRODUK */}
                  {item.options && (
                    <p className="item-options">
                      {Object.values(item.options)
                        .map((opt: any) => opt.name)
                        .join(" • ")}
                    </p>
                  )}

                  <p className="item-price">
                    Rp {Number(item.product.price).toLocaleString("id-ID")}
                  </p>
                </div>
                    <button
                      className="item-remove-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Hapus
                    </button>

                </div>
              ))}
            </div>

            <div className="cart-summary-box">
              <h2>Ringkasan Pesanan</h2>
              <p>Total: Rp {totalPrice.toLocaleString("id-ID")}</p>

              <button
                className="checkout-button-full"
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
        <CheckoutModal
          onClose={() => setIsCheckoutModalOpen(false)}
          onSubmit={handleCheckoutSubmit}
        />
      )}
    </div>
  );
}
