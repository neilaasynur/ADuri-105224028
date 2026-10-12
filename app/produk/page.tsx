import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { DURIAN_PRODUCTS } from "@/data/products";

export const metadata = {
  title: "Katalog Durian Riau — Pilihan Lengkap Kebun Keluarga",
  description: "Daftar lengkap durian Kampung, Montong, Musang King, dan Tembaga Riau segar langsung dari kebun."
};

export default function CatalogPage() {
  return (
    <>
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-amber-400 focus:text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800"
      >
        Lompati ke konten utama
      </a>

      <Navbar currentPath="/produk" />

      <main id="main-content" tabIndex={-1} className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 outline-none">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
          <ol className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 m-0 p-0 list-none">
            <li>
              <Link href="/" className="hover:underline hover:text-[#31572c]">
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-bold text-[#26321f]" aria-current="page">
              Katalog Durian
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="bg-[#e9f1d5] rounded-2xl p-5 sm:p-8 border border-[#d3e2b1] mb-6 sm:mb-8 space-y-2">
          <mark className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#fff3b8] text-[#624d00]">
            KATALOG LENGKAP
          </mark>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26321f]">
            Katalog Durian Segar Riau
          </h1>
          <p className="text-xs sm:text-base text-neutral-700 max-w-2xl leading-relaxed">
            Jelajahi berbagai varietas durian terbaik panen kebun keluarga. Garansi penggantian jika ada buah mentah atau busuk.
          </p>
        </header>

        {/* Responsive Product Grid */}
        <section aria-label="Daftar Produk Durian">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-0 m-0 list-none">
            {DURIAN_PRODUCTS.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
}
