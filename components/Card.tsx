"use client";
import React from "react";
import "./Card.css"; 
import { Skeleton } from "@/components/ui/skeleton"

interface CardProps {
  image: string;
  title: string;
  price: string;
  onClick: () => void;
}

export default function Card({ image, title, price, onClick }: CardProps) {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-image-container">
        <img src={image} alt={title} className="card-image" />
        <div 
          className="card-plus" 
          onClick={(e) => {
            e.stopPropagation(); 
            console.log(`Tombol Plus diklik untuk ${title}!`);
          }}
        >
          +
        </div>
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{price}</p> 
      </div>
    </div>
  );
}