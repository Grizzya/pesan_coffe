"use client";

import React, { useEffect, useState } from "react";
import "./ProductDetailModal.css";
import { useCart } from "@/context/CartContext";

/* =====================
   TYPES
===================== */

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

interface Choice {
  name: string;
  price: number;
}

interface MenuOption {
  id: number;
  name: string;
  choices: Choice[];
}

/* =====================
   COMPONENT
===================== */

export default function ProductDetailModal({ product, onClose }: ModalProps) {
  const { addToCart } = useCart();

  const [options, setOptions] = useState<MenuOption[]>([]);
  const [selected, setSelected] = useState<Record<number, Choice>>({});
  const [loading, setLoading] = useState(false);

  /* =====================
     FETCH OPTIONS
  ===================== */

  useEffect(() => {
    if (!product) return;

    setLoading(true);

    fetch("/api/menus/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menu_id: product.id }),
    })
      .then((res) => res.json())
      .then((json) => {
        const data: MenuOption[] = json.data || [];
        setOptions(data);

        const defaults: Record<number, Choice> = {};
        data.forEach((opt) => {
          if (opt.choices.length > 0) {
            defaults[opt.id] = opt.choices[0];
          }
        });
        setSelected(defaults);
      })
      .finally(() => setLoading(false));
  }, [product]);

  if (!product) return null;

  /* =====================
     ADD TO CART (FIX)
  ===================== */

  const handleAdd = () => {
    addToCart(product, selected);
    onClose();
  };

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">{product.title.toUpperCase()}</h2>

        {loading && <p>Memuat opsi...</p>}

        {!loading &&
          options.map((opt) => (
            <OptionSection
              key={opt.id}
              option={opt}
              selected={selected[opt.id]}
              onSelect={(choice) =>
                setSelected((prev) => ({
                  ...prev,
                  [opt.id]: choice,
                }))
              }
            />
          ))}

        <button className="modal-add-button" onClick={handleAdd}>
          TAMBAH
        </button>
      </div>
    </div>
  );
}

/* =====================
   OPTION SECTION
===================== */

interface OptionSectionProps {
  option: MenuOption;
  selected?: Choice;
  onSelect: (choice: Choice) => void;
}

function OptionSection({ option, selected, onSelect }: OptionSectionProps) {
  return (
    <div className="option-section">
      <h3 className="option-title">{option.name}</h3>

      <div
        className="option-buttons"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, max-content))",
          gap: "12px",
          justifyContent: "center",
        }}
      >
        {option.choices.map((choice) => (
          <button
            key={choice.name}
            className={`option-button ${
              selected?.name === choice.name ? "selected" : ""
            }`}
            onClick={() => onSelect(choice)}
          >
            {choice.name}
            {choice.price > 0 && (
              <span>+Rp {choice.price.toLocaleString()}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
