import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotifikasiPopUp from "@/components/NotifikasiPopUp";
import { bacaSesi } from "@/schema/sesi";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesi = await bacaSesi();

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
        <Navbar sesi={sesi ? { email: sesi.email } : null} />

        {/* 2. Kontainer Konten Halaman Aktif */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* 3. Footer Navigasi & Info Bisnis */}
        <Footer />

        {/* 4. Pop-up Notifikasi Global di Bawah Layar */}
        <Suspense fallback={null}>
          <NotifikasiPopUp />
        </Suspense>
      </body>
    </html>
  );
}
