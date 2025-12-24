"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

// TYPES

export interface Product {
  id: number;
  title: string;
  price: number;
  image?: string | null;  
}

export interface CartOptions {
  [key: string]: any;
}

export interface CartItem {
  id: string;
  name: string;
  product: Product;
  options: CartOptions;
  quantity: number;
  
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  addToCart: (
    product: Product,
    options?: CartOptions,
    quantity?: number
  ) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

// CONTEXT

const CartContext = createContext<CartContextType | undefined>(undefined);

// PROVIDER

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const addToCart = (
    product: Product,
    options: CartOptions = {},
    quantity = 1
  ) => {
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      name: product.title || "Produk",
      product,
      options,
      quantity: Math.max(1, Math.floor(quantity)),
    };

    setCartItems((prev) => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ================= HOOK =================

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
}
