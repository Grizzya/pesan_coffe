// components/ProductDetailModal.tsx
"use client";
import React, { useState } from "react";
import "./ProductDetailModal.css";
import { useCart } from "@/context/CartContext";

// (Interface Product, ModalProps, Tipe Opsi Tuan)
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}
interface ModalProps {
  product: Product | null;
  onClose: () => void;
}
type SugarOption = "Normal Sugar" | "Less Sugar" | "No Sugar" | "Extra Sugar";
type IceOption = "Normal Ice" | "Less Ice" | "No Ice" | "Extra Ice";

export default function ProductDetailModal({ product, onClose }: ModalProps) {
  const [sugar, setSugar] = useState<SugarOption>("Normal Sugar");
  const [ice, setIce] = useState<IceOption>("Normal Ice");
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, {
      sugar: sugar,
      ice: ice,
    });
    onClose();
  };

  return (
    // ⚙️ Animasi Latar Belakang (Fade In)
    <div className="modal-overlay animate-in fade-in-0 duration-200" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          modal-content
          w-[750px]
          max-w-[95vw]
          rounded-2xl
          shadow-lg
          flex flex-col
          bg-[#f6f6f6]
          
          /* ⚙️ PERBAIKAN: 
             Kita definisikan animasi Desktop DAN HP di sini.
             'sm:' adalah prefix Tailwind untuk 'layar lebih besar dari HP'.
          */
          
          /* Animasi HP (Default): Slide dari bawah */
          animate-in fade-in-0 slide-in-from-bottom-full duration-300
          
          /* Animasi Desktop (sm:): Ganti ke Zoom In */
          sm:zoom-in-95 sm:slide-in-from-bottom-0
        `}
      >
        {/* Tombol Close */}
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">{product.title.toUpperCase()}</h2>

        {/* Pilihan Opsi */}
        <div className="modal-options-container">
          {/* Opsi Gula */}
          <OptionSection
            title="Gula"
            options={[
              { name: "Normal Sugar", price: "Gratis" },
              { name: "Less Sugar", price: "Gratis" },
              { name: "No Sugar", price: "Gratis" },
              { name: "Extra Sugar", price: "Gratis" },
            ]}
            selected={sugar}
            setSelected={setSugar as (option: string) => void}
          />

          {/* Opsi Es */}
          <OptionSection
            title="Es"
            options={[
              { name: "Normal Ice", price: "Gratis" },
              { name: "Less Ice", price: "Gratis" },
              { name: "No Ice", price: "Gratis" },
              { name: "Extra Ice", price: "Gratis" },
            ]}
            selected={ice}
            setSelected={setIce as (option: string) => void}
          />
        </div>

        {/* Tombol Tambah */}
        <button className="modal-add-button" onClick={handleAdd}>
          TAMBAH
        </button>
      </div>
    </div>
  );
}

interface OptionSectionProps {
  title: string;
  options: { name: string; price: string }[];
  selected: string;
  setSelected: (option: string) => void;
}
function OptionSection({ title, options, selected, setSelected }: OptionSectionProps) {
  return (
    <div className="option-section">
      <h3 className="option-title">{title}</h3>
      <div
        className="option-buttons"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          justifyItems: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {options.map((opt) => (
          <button
            key={opt.name}
            className={`option-button ${selected === opt.name ? "selected" : ""}`}
            onClick={() => setSelected(opt.name)}
          >
            {opt.name}
            <span>{opt.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}