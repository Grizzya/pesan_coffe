import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// ⚙️ Import biasa, JANGAN pakai dynamic(() => ..., { ssr: false }) di sini
import Header from "@/components/Header"; 
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";

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
      <head>
        <Script
          type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 m-0 p-0`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}