"use client";

import React, { useState } from 'react';
import "./CheckoutModal.css"; 

interface CheckoutModalProps {
  onClose: () => void;
  onSubmit: (details: { name: string, email: string }) => void;
}

export default function CheckoutModal({ onClose, onSubmit }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Nama dan Email wajib diisi.");
      return;
    }
    setLoading(true);
    onSubmit({ name, email });
  };

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div 
        className="checkout-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="checkout-modal-header">
          <h2 className="checkout-modal-title">Detail Pelanggan</h2>
          <button className="checkout-modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="checkout-modal-form">
          <p className="checkout-modal-subtitle">
            Silakan isi data Anda sebelum melanjutkan ke pembayaran.
          </p>
          
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nama
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
              placeholder="Nama Anda"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="email@anda.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="form-submit-button"
          >
            {loading ? 'Memproses...' : 'Lanjut Pembayaran'}
          </button>
        </form>
      </div>
    </div>
  );
}