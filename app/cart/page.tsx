"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import CheckoutModal from "@/components/CheckoutModal";
import "./cart.css";

declare global {
  interface Window {
    snap: any;
  }
}

/* =========================
   HELPER: options -> catatan STRING
   ========================= */
function optionsToCatatan(options?: Record<string, any>) {
  if (!options || Object.keys(options).length === 0) return null;

  return Object.entries(options)
    .map(([key, value]) => {
      // support { label, name } atau string biasa
      if (typeof value === "object" && value !== null) {
        return `${value.label ?? key}: ${value.name ?? value}`;
      }
      return `${key}: ${value}`;
    })
    .join(", ");
}

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, totalItems, clearCart } = useCart();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /* =========================
     TOTAL PRICE
     ========================= */
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.product.price) || 0;
    const qty = item.quantity ?? 1;
    return total + price * qty;
  }, 0);

  /* =========================
     CHECKOUT SUBMIT
     ========================= */
  const handleCheckoutSubmit = async (data: {
    name: string;
    email: string;
  }) => {
    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail(data.email)) {
      alert("Format email tidak valid");
      return;
    }

    setIsCheckoutModalOpen(false);
    await handlePayment(data.name, data.email);
  };

  /* =========================
     HANDLE PAYMENT (FINAL)
     ========================= */
  const handlePayment = async (name: string, email: string) => {
    if (isProcessing || cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      const items = cartItems.map((item) => {
        const jumlah = Number(item.quantity ?? 1);
        const harga = Number(item.product.price);

        return {
          menu_id: Number(item.product.id),
          jumlah,
          sub_total: harga * jumlah,
          catatan: optionsToCatatan(item.options), // ✅ STRING
        };
      });

      // DEBUG (hapus jika sudah yakin)
      console.log("PAYLOAD ITEMS:", items);

      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_pelanggan: name,
          email,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        console.error("PAYMENT ERROR:", data);
        alert("Gagal membuat transaksi");
        setIsProcessing(false);
        return;
      }

      window.snap.pay(data.token, {
        onSuccess: (result: any) => {
          sessionStorage.setItem("last_order_id", result.order_id);
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
          alert("Pembayaran dibatalkan");
          setIsProcessing(false);
        },
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
      setIsProcessing(false);
    }
  };

  /* =========================
     RENDER
     ========================= */
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
                  <div className="cart-item-image">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : null}
                    <div
                      className={`image-skeleton ${
                        item.product.image ? "hidden" : ""
                      }`}
                    />
                  </div>

                  <div className="item-details">
                    <h3>{item.product.title}</h3>

                    {item.options &&
                      Object.keys(item.options).length > 0 && (
                        <ul className="item-options">
                          {Object.entries(item.options).map(
                            ([key, opt]: any) => (
                              <li key={key}>
                                {opt.label ?? key}: {opt.name ?? opt}
                              </li>
                            )
                          )}
                        </ul>
                      )}

                    <p>
                      Rp{" "}
                      {(
                        Number(item.product.price) *
                        (item.quantity ?? 1)
                      ).toLocaleString("id-ID")}
                    </p>

                    <p>Jumlah: {item.quantity ?? 1}</p>
                  </div>

                  <button onClick={() => removeFromCart(item.id)}>
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
                disabled={isProcessing || totalItems === 0}
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
