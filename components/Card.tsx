"use client";
import React, { useState } from "react";
// ⚙️ Pastikan file Card.css ada di folder yang sama
import "./Card.css"; 
// ⚙️ Pastikan Tuan sudah menginstall skeleton shadcn
// Jika belum, jalankan: npx shadcn-ui@latest add skeleton
import { Skeleton } from "@/components/ui/skeleton";

interface CardProps {
  image: string;
  title: string;
  price: string;
  onClick: () => void;
}

export default function Card({ image, title, price, onClick }: CardProps) {
  // State untuk melacak apakah gambar sudah selesai dimuat
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Jika image dari DB kosong/null, gunakan dummy
  const imageSrc = image && image.trim() !== "" ? image : "/dummy.png"; 

  return (
    <div className="card" onClick={onClick}>
      <div className="card-image-container">
        
        {/* 1. SKELETON (Muncul saat imageLoaded === false) */}
        {!imageLoaded && (
           <Skeleton 
             className="absolute top-0 left-0 w-[149px] h-[149px] rounded-tl-[15px] rounded-tr-[80px] rounded-br-[15px] rounded-bl-[15px]" 
             style={{ backgroundColor: '#e0e0e0' }} 
           />
        )}

        {/* 2. GAMBAR ASLI */}
        <img 
          src={imageSrc} 
          alt={title} 
          // Gunakan opacity untuk transisi halus
          className={`card-image transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
             // Jika error, anggap loaded (agar skeleton hilang) dan ganti ke dummy
             setImageLoaded(true);
             (e.target as HTMLImageElement).src = '/dummy.png'; 
          }}
        />

        {/* Tombol Plus */}
        <div 
          className="card-plus" 
          onClick={(e) => {
            e.stopPropagation(); 
            console.log(`Tombol Plus diklik untuk ${title}!`);
            // Tambahkan logika 'Add to Cart' cepat di sini
          }}
        >
          +
        </div>
      </div>
      
      <div className="card-content">
        <h3>{title}</h3>
        <p>Rp {price}</p> 
      </div>
    </div>
  );
}