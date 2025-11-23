"use client";
import CardList from "@/components/CardList";
import ProductDetailModal from "@/components/ProductDetailModal";
import React, { useState } from "react";
import "@/app/globals.css";
import "./page.css";
import CartWidget from "@/components/CartWidget";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("espresso");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="image-cropper">
        <img src="/banner1.png" alt="Banner Kopi" />
      </div>

      <div className="nav-section">
        <div className="main-nav-bg"></div>
        <nav className="main-nav">
          <ul>
            {/* ... (Kode Navigasi) ... */}
            <li>
              <a 
                onClick={() => setActiveCategory("signature")}
                className={activeCategory === 'signature' ? 'active-link' : ''}
              >
                SIGNATURE'S
              </a>
            </li>
            <li>
              <a 
                onClick={() => setActiveCategory("espresso")}
                className={activeCategory === 'espresso' ? 'active-link' : ''}
              >
                BASIC ESPRESSO
              </a>
            </li>
            <li>
              <a 
                onClick={() => setActiveCategory("noncoffee")}
                className={activeCategory === 'noncoffee' ? 'active-link' : ''}
              >
                NON COFFEE
              </a>
            </li>
            <li>
              <a 
                onClick={() => setActiveCategory("snack")}
                className={activeCategory === 'snack' ? 'active-link' : ''}
              >
                SNACK
              </a>
            </li>
            <li>
              <a 
                onClick={() => setActiveCategory("food")}
                className={activeCategory === 'food' ? 'active-link' : ''}
              >
                MAKANAN
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <section className="product-section">
        <CardList 
          category={activeCategory} 
          onProductClick={handleProductClick}
        />
      </section>

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
        />
      )}

      <CartWidget />
    </>
  );
}