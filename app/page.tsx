import Link from "next/link";
import HeroSection from "@/components/features/home/HeroSection";
import AboutSection from "@/components/features/home/AboutSection";
import ProductCard from "@/components/features/products/ProductCard";
import { DURIAN_PRODUCTS } from "@/data/products";

export default function Home() {
  const featuredProducts = DURIAN_PRODUCTS.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-14">
      {/* 1. Hero Section Banner */}
      <HeroSection />

      {/* 2. Featured Products Section */}
      <section id="produk" aria-labelledby="produk-heading">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <hgroup>
            <h2 id="produk-heading" className="text-xl sm:text-3xl font-bold text-[#26321f]">
              Durian Pilihan Favorit
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Pilih durian sesuai selera dan kebutuhanmu.
            </p>
          </hgroup>
          <p className="m-0">
            <Link
              href="/produk"
              className="inline-flex items-center gap-1 font-bold text-[#31572c] hover:underline min-h-[44px] sm:min-h-0 text-sm sm:text-base"
            >
              Lihat Semua ({DURIAN_PRODUCTS.length}) &rarr;
            </Link>
          </p>
        </header>

        {/* Responsive Product Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-0 m-0 list-none">
          {featuredProducts.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      {/* 3. About & Delivery Section */}
      <AboutSection />
    </div>
  );
}
