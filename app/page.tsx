"use client";
import React, { useState } from "react";
import useSWR from "swr";
import CardList from "@/components/CardList";
import ProductDetailModal from "@/components/ProductDetailModal";
import "@/app/globals.css";
import "./page.css";
import CartWidget from "@/components/CartWidget";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface Category {
  id: number;
  name: string;
}

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json()).then((json) => json.data);

export default function HomePage() {
  // "" = semua kategori
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: categories, error } = useSWR<Category[]>(
    "/api/categories",
    fetcher
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="image-cropper">
  <picture>
    {/* Dipakai di HP */}
    <source srcSet="/BANNER1a.png" media="(max-width: 480px)" />
    {/* Dipakai di tablet/desktop */}
    <img src="/2.png" alt="Banner Kopi" />
  </picture>
</div>

      <div className="nav-section">
        <div className="main-nav-bg"></div>
        <nav className="main-nav">
          <ul>
            {/* tombol SEMUA */}
            <li>
              <a
                onClick={() => setActiveCategory("")}
                className={activeCategory === "" ? "active-link" : ""}
              >
                SEMUA
              </a>
            </li>

            {/* loading / error */}
            {error && <li><span>Gagal load kategori</span></li>}
            {!categories && !error && <li><span>Memuat kategori...</span></li>}

            {/* kategori dari database */}
            {categories?.map((cat) => (
              <li key={cat.id}>
                <a
                  onClick={() => setActiveCategory(cat.name)}
                  className={activeCategory === cat.name ? "active-link" : ""}
                >
                  {cat.name.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <section className="product-section">
        <CardList
          category={activeCategory} // "" = semua, "espresso" = filter
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
