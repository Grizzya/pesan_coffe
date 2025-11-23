// app/cart/page.tsx
"use client";

import React, { useState } from 'react'; // ⬅️ TAMBAHKAN: Impor useState
import { useCart } from '@/context/CartContext'; 
import Link from 'next/link';
import Image from 'next/image';
import "./cart.css"; 
// ⚙️ TAMBAHKAN: Impor Modal Checkout baru Tuan
import CheckoutModal from '@/components/CheckoutModal';

// Deklarasi 'window.snap' agar TypeScript tidak error
declare global {
  interface Window {
    snap: any;
  }
}

export default function CartPage() {
  const { cartItems, removeFromCart, totalItems } = useCart();
  
  // ⚙️ TAMBAHKAN: State untuk mengontrol modal Nama/Email
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // ... (Kalkulasi total harga Tuan) ...
  const totalPrice = cartItems.reduce((total, item) => {
    const priceAsNumber = parseFloat(item.product.price.toString().replace(/[^0-9]/g, ''));
    return total + priceAsNumber;
  }, 0);
  
  // ⚙️ TAMBAHKAN: Fungsi ini akan dipanggil oleh Modal Tuan
  const handleCheckoutSubmit = (details: { name: string, email: string }) => {
    console.log("Nama dan Email diterima:", details);
    console.log("Keranjang:", cartItems);
    alert("Data diterima! (Cek Console). Siap untuk Midtrans.");

    // NANTI: Di sinilah Tuan akan memanggil API Midtrans Tuan
    // const token = await fetch('/api/payment', ...);
    // window.snap.pay(token);
    
    // Tutup modal setelah selesai (Tuan bisa biarkan terbuka saat loading)
    setIsCheckoutModalOpen(false); 
  };

  return (
    <div className="cart-page-container">
      <nav className="cart-nav">
        <Link href="/">
          &larr; Kembali Belanja
        </Link>
      </nav>

      <main className="cart-main">
        <h1>Keranjang Anda</h1>

        {totalItems === 0 ? (
          <div className="cart-empty">
            <p>Keranjang Anda masih kosong.</p>
          </div>
        ) : (
          <div className="cart-content">
            {/* ... (Daftar Item Tuan) ... */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <Image 
                    src={item.product.image} 
                    alt={item.product.title} 
                    width={80} 
                    height={80}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h3>{item.product.title}</h3>
                    <p className="item-options">
                      {item.options.sugar}, {item.options.ice}
                    </p>
                    <p className="item-price">
                      Rp {item.product.price.toLocaleString('id-ID')}
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

            {/* Ringkasan Total */}
            <div className="cart-summary-box">
              <h2>Ringkasan Pesanan</h2>
              <div className="summary-row">
                <span>Total Harga ({totalItems} item)</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="summary-row total">
                <span>Total Keseluruhan</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              
              {/* ⚙️ PERBAIKAN: Hapus <Link>, ganti jadi <button> biasa */}
              <button 
                className="checkout-button-full"
                style={{ marginTop: '16px', width: '100%', cursor: 'pointer' }}
                onClick={() => setIsCheckoutModalOpen(true)} // ⬅️ Buka Modal
              >
                Lanjut ke Pembayaran
              </button>
              
            </div>
          </div>
        )}
      </main>
      
      {/* ⚙️ TAMBAHKAN: Tampilkan Modal Checkout Tuan di sini */}
      {isCheckoutModalOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutModalOpen(false)}
          onSubmit={handleCheckoutSubmit}
        />
      )}
      
    </div>
  );
}