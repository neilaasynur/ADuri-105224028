"use client";

import { useState } from "react";
import Link from "next/link";

// Definisikan props langsung di sini dengan tanda '?' agar opsional
interface NavbarProps {
  currentPath?: string;
}

export default function Navbar({ currentPath = "/" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#31572c] text-white shadow-md sticky top-0 z-50">
      <nav
        aria-label="Navigasi Utama"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"
      >
        {/* Top Bar: Logo & Mobile Menu Toggle */}
        <section className="flex items-center justify-between gap-3">
          <section className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold tracking-wide flex items-center gap-2 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded px-1 min-h-[44px]"
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-current shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <span>ADuri</span>
            </Link>
          </section>

          {/* Hamburger Toggle Button for Mobile Screens */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-controls="mobile-menu-list"
            className="md:hidden inline-flex items-center justify-center p-2.5 rounded-lg text-white hover:bg-emerald-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[44px] min-w-[44px]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </section>

        {/* Menu Items Container (Responsive Drawer on Mobile, Row on Desktop) */}
        <section
          id="mobile-menu-list"
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-emerald-800/80 transition-all duration-300`}
        >
          <ul className="flex flex-col md:flex-row items-stretch md:items-center gap-1.5 md:gap-4 m-0 p-0 list-none">
            <li>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 md:py-1.5 rounded-lg text-base md:text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[44px] md:min-h-0 ${
                  currentPath === "/"
                    ? "bg-emerald-900/60 md:bg-transparent text-amber-300 font-bold underline decoration-2 underline-offset-4"
                    : "text-white hover:bg-emerald-800/50 md:hover:bg-transparent hover:text-amber-200"
                }`}
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                href="/produk"
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 md:py-1.5 rounded-lg text-base md:text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[44px] md:min-h-0 ${
                  currentPath.startsWith("/produk")
                    ? "bg-emerald-900/60 md:bg-transparent text-amber-300 font-bold underline decoration-2 underline-offset-4"
                    : "text-white hover:bg-emerald-800/50 md:hover:bg-transparent hover:text-amber-200"
                }`}
              >
                Katalog Durian
              </Link>
            </li>
            <li>
              <Link
                href="/ambil-sendiri"
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 md:py-1.5 rounded-lg text-base md:text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[44px] md:min-h-0 ${
                  currentPath === "/ambil-sendiri"
                    ? "bg-emerald-900/60 md:bg-transparent text-amber-300 font-bold underline decoration-2 underline-offset-4"
                    : "text-white hover:bg-emerald-800/50 md:hover:bg-transparent hover:text-amber-200"
                }`}
              >
                Ambil Sendiri
              </Link>
            </li>
            <li>
              <Link
                href="/#tentang"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2.5 md:py-1.5 rounded-lg text-base md:text-sm font-medium text-white hover:bg-emerald-800/50 md:hover:bg-transparent hover:text-amber-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[44px] md:min-h-0"
              >
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link
                href="/#kontak"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2.5 md:py-1.5 rounded-lg text-base md:text-sm font-medium text-white hover:bg-emerald-800/50 md:hover:bg-transparent hover:text-amber-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[44px] md:min-h-0"
              >
                Kontak
              </Link>
            </li>
            <li className="pt-2 md:pt-0">
              <Link
                href="/pembayaran"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center bg-amber-400 hover:bg-amber-300 text-[#26321f] font-bold px-4 py-3 md:py-2 rounded-xl text-base md:text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-sm min-h-[44px]"
              >
                Pesanan / Pembayaran
              </Link>
            </li>
          </ul>
        </section>
      </nav>
    </header>
  );
}
