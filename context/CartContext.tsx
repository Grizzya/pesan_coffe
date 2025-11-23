// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tentukan tipe data
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CartOptions {
  sugar: string;
  ice: string;
}

export interface CartItem {
  id: string; // ID unik untuk setiap item di keranjang
  product: Product;
  options: CartOptions;
}

// Tentukan apa yang akan disediakan oleh Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, options: CartOptions) => void;
  removeFromCart: (itemId: string) => void;
  totalItems: number;
}

// Buat Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Buat Provider (Penyedia State)
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, options: CartOptions) => {
    const newItem: CartItem = {
      id: `${product.id}_${Date.now()}`, // Buat ID unik
      product,
      options,
    };
    setCartItems(prevItems => [...prevItems, newItem]);
    console.log("Item ditambahkan:", newItem);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const totalItems = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

// Buat Hook (jalan pintas untuk memakai context)
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};