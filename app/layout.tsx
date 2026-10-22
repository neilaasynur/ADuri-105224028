import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADuri — Durian Asli Riau Langsung dari Kebun Keluarga",
  description:
    "Platform penjualan durian kebun keluarga Asynur di Riau. Pilihan varietas durian berkualitas manis legit, pengiriman segar, dan kunjungan ambil sendiri di kebun.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#faf8f1] text-[#26321f]">
        {/* Link Aksesibilitas Langsung ke Konten Utama */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-amber-400 focus:text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800"
        >
          Lompat ke konten utama
        </a>

        {/* 1. Header & Navigasi Utama */}
        <Navbar />

        {/* 2. Kontainer Konten Halaman Aktif */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* 3. Footer Navigasi & Info Bisnis */}
        <Footer />
      </body>
    </html>
  );
}
