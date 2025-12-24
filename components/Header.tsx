"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  return (
    <Sheet>
      <header className="w-full bg-white border-b border-white-300 shadow-sm z-40">
        <div className="flex justify-between items-center px-6 py-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Logos.png"
              alt="Logo"
              width={50}
              height={50}
              priority
            />
            <span className="text-xl font-semibold text-gray-900 select-none">
              Mr KSG
            </span>
          </Link>

          <SheetTrigger asChild>
            <button className="text-gray-800 hover:text-gray-600 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </SheetTrigger>
        </div>
      </header>


      <SheetContent side="right" className="w-full md:w-1/4">
        <SheetHeader>
          <SheetTitle className="text-2xl text-gray-800">Menu</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-4 px-6 text-lg mt-8">
          <SheetClose asChild>
            <Link href="/" className="hover:text-gray-600 transition">
              🏠 Home
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/about" className="hover:text-gray-600 transition">
              📖 About
            </Link>
          </SheetClose> 
          <SheetClose asChild>
            <Link href="/menu" className="hover:text-gray-600 transition">
              ☕ Menu
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
