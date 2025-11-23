import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mr KSG",
  description: "Aplikasi pemesanan kopi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 m-0 p-0`}>
          <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}