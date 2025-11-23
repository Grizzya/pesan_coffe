"use client";

import React from 'react';
import { useCart } from '@/context/CartContext'; 
import { ShoppingBag } from 'lucide-react'; 
import Link from 'next/link'; 
export default function CartWidget() {
  const { totalItems, cartItems } = useCart();

  if (totalItems === 0) {
    return null;
  }

  const totalPrice = cartItems.reduce((total, item) => {
    const priceAsNumber = parseFloat(item.product.price.toString().replace(/[^0-9]/g, ''));
    return total + priceAsNumber;
  }, 0);

  return (
    <Link href="/cart" className="cart-widget-link">
      <div className="cart-widget">
        <div className="cart-icon">
          <ShoppingBag size={24} />
          <span className="item-count">{totalItems}</span>
        </div>
        <div className="cart-summary">
          <span className="summary-text">Total Pesanan</span>
          <span className="summary-price">
            Rp {totalPrice.toLocaleString('id-ID')}
          </span>
        </div>

        <button className="checkout-button">
          Bayar
        </button>
      </div>
    </Link>
  );
}