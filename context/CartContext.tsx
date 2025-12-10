"use client";

import React, { createContext, useContext, useEffect, useState } from "react";


// Tipe produk - sesuaikan bila di project-mu ada fields lain

export interface Product {
  id: number | string;
  title: string;
  price: number;
  image?: string;
}


 //Opsi tambahan tiap item (misal: sugar, ice)

export interface CartOptions {
  sugar?: string;
  ice?: string;
  [key: string]: any;
}


 //Item yang disimpan di keranjang

export interface CartItem {
  id: string;           
  product: Product;
  options?: CartOptions;
  quantity: number;     
}

/**
 * Tipe context yang diekspos
 */
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, options?: CartOptions, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number; // jumlah semua qty
  totalPrice: number; // total harga (product.price * qty)
}

/**
 * Buat context
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Provider
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  //optional: persist ke localStorage supaya data tidak hilang saat reload
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pc_cart_v1");
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        setCartItems(parsed);
      }
    } catch (e) {
      // ignore parse errors
      console.warn("Gagal load cart dari localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("pc_cart_v1", JSON.stringify(cartItems));
    } catch (e) {
      // ignore storage errors
      console.warn("Gagal simpan cart ke localStorage", e);
    }
  }, [cartItems]);

  // --- addToCart: menambahkan item baru (default quantity = 1) ---
  const addToCart = (product: Product, options: CartOptions = {}, quantity = 1) => {
    const newItem: CartItem = {
      id: `${product.id}_${Date.now()}`,
      product,
      options,
      quantity: Math.max(1, Math.floor(quantity)),
    };
    setCartItems((prev) => [...prev, newItem]);
    console.log("Item ditambahkan:", newItem);
  };

  // --- removeFromCart by cart item id ---
  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  // --- update quantity (set specific quantity) ---
  const updateQuantity = (itemId: string, quantity: number) => {
    const q = Math.max(1, Math.floor(quantity));
    setCartItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, quantity: q } : it)));
  };

  // --- clear cart ---
  const clearCart = () => {
    setCartItems([]);
  };

  // --- derived values ---
  const totalItems = cartItems.reduce((s, it) => s + (it.quantity ?? 1), 0);
  const totalPrice = cartItems.reduce((s, it) => s + (Number(it.product.price) || 0) * (it.quantity ?? 1), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook helper untuk konsumsi context
 */
export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
