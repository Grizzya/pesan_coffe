// app/checkout/page.tsx
"use client";

import React, { useState } from 'react';
// ⚙️ Pastikan Tuan mengimpor 'useCart' dari context Tuan
import { useCart } from '@/context/CartContext'; 
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, totalItems } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Hitung total harga
  const totalPrice = cartItems.reduce((total, item) => {
    // ⚙️ Logika untuk mengubah "Rp 25.000" menjadi angka 25000
    const priceAsNumber = parseFloat(item.product.price.toString().replace(/[^0-9]/g, ''));
    return total + priceAsNumber;
  }, 0);

  // ⚙️ Fungsi ini HANYA akan menampilkan data di console untuk saat ini
  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Nama dan Email wajib diisi.");
      return;
    }
    setLoading(true);

    console.log("--- PESANAN SIAP DIPROSES ---");
    console.log("Nama Pelanggan:", name);
    console.log("Email Pelanggan:", email);
    console.log("Total Harga:", totalPrice);
    console.log("Item:", cartItems);
    console.log("---------------------------------");
    
    // NANTI: Di sinilah kita akan memanggil API Midtrans
    alert("Pesanan Anda Diterima! (Cek Console Log). Pembayaran Midtrans akan ditambahkan nanti.");
    
    setLoading(false);
    // clearCart();
  };

  return (
    //  Ini adalah layout dari HeroUI, sudah disesuaikan
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Tombol Kembali ke Keranjang */}
        <Link href="/cart" className="text-sm font-medium text-green-700 hover:text-green-600">
          &larr; Kembali ke Keranjang
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Bagian Kiri: Formulir (Dari HeroUI) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Detail Pelanggan</h2>
            
            {/* ⚙️ Arahkan form ke fungsi handleProcessOrder */}
            <form onSubmit={handleProcessOrder}>
              <div className="space-y-4">
                {/* Nama */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Nama Anda"
                  />
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="email@anda.com"
                  />
                </div>
              </div>

              {/* Tombol Bayar */}
              <button
                type="submit"
                disabled={loading || totalItems === 0}
                className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
              >
                {loading ? 'Memproses...' : `Proses Pesanan (Rp ${totalPrice.toLocaleString('id-ID')})`}
              </button>
            </form>
          </div>

          {/* Bagian Kanan: Ringkasan Keranjang */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.options.sugar}, {item.options.ice}
                    </p>
                  </div>
                  <p className="font-medium">
                    Rp {parseFloat(item.product.price.toString().replace(/[^0-9]/g, '')).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-lg font-bold">
                <p>Total</p>
                <p>Rp {totalPrice.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}