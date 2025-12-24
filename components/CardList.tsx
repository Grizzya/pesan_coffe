"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/Card";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CardListProps {
  category: string; // "" = semua kategori
  onProductClick: (product: Product) => void;
}

const CardList: React.FC<CardListProps> = ({ category, onProductClick }) => {
  const [cards, setCards] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // ambil semua produk
        const url = category
          ? `/api/products?category=${encodeURIComponent(category)}`
          : "/api/products";

        const res = await fetch(url);

        if (!res.ok) {
          console.error("Gagal mengambil data dari API:", res.status, res.statusText);
          setCards([]);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setCards(data);
        } else {
          console.error("Data yang diterima dari API bukan array:", data);
          setCards([]);
        }
      } catch (err) {
        console.error("Gagal memuat data produk:", err);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  if (loading) {
    return (
      <div className="text-center italic text-gray-500 py-10">
        Memuat produk...
      </div>
    );
  }

  if (!Array.isArray(cards) || cards.length === 0) {
    return (
      <div className="text-center italic text-gray-500 py-10">
        Tidak ada produk.
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-6
        grid-cols-[repeat(auto-fill,minmax(169px,1fr))]
        w-full
      "
    >
      {cards.map((item) => (
        <Card
          key={item.id}
          title={item.title}
          price= {item.price.toString()}
          image={item.image}
          onClick={() => onProductClick(item)}
        />
      ))}
    </div>
  );
};

export default CardList;
