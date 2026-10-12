import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { DURIAN_PRODUCTS } from "@/data/products";

export default function Home() {
  const featuredProducts = DURIAN_PRODUCTS.slice(0, 3);

  return (
    <>
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-amber-400 focus:text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800"
      >
        Lompati ke konten utama
      </a>

      {/* Navigasi Utama */}
      <Navbar currentPath="/" />

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 outline-none">
        {/* Hero Section */}
        <section
          aria-labelledby="hero-heading"
          className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 bg-[#e9f1d5] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-[#d3e2b1]"
        >
          <article className="flex-1 space-y-3 text-left w-full">
            <h1 id="hero-heading" className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#26321f] leading-tight">
              Durian Asli Riau, Langsung dari Kebun Keluarga
            </h1>
            <p className="text-sm sm:text-lg text-neutral-700 leading-relaxed max-w-xl">
              Nikmati durian pilihan dari kebun keluarga. Fokus melayani pelanggan
              di Riau dengan buah segar, garansi rasa manis legit, dan dikirim cepat.
            </p>
            <p className="pt-2 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/produk"
                className="flex items-center justify-center px-6 py-3 bg-[#31572c] hover:bg-[#254322] active:bg-[#1a3018] text-white font-bold rounded-xl transition-colors shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/50 min-h-[44px]"
              >
                Lihat Katalog Durian
              </Link>
              <Link
                href="/pembayaran"
                className="flex items-center justify-center px-6 py-3 bg-white hover:bg-neutral-100 text-[#31572c] border border-[#31572c] font-bold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 min-h-[44px]"
              >
                Pesan Langsung
              </Link>
            </p>
          </article>

          {/* Foto Durian Hero */}
          <figure className="w-full lg:w-[320px] h-48 sm:h-60 lg:h-64 rounded-2xl overflow-hidden shrink-0 m-0 relative bg-white/70 p-3 sm:p-4 flex items-center justify-center shadow-sm border border-[#dedbcf]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/durian.png"
              alt="Buah durian utuh berduri dan dua ulas daging durian matang berwarna kuning manis"
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            <figcaption className="sr-only">
              Foto durian utuh dan dua ulas daging durian kuning mekar
            </figcaption>
          </figure>
        </section>

        {/* Featured Products Section */}
        <section id="produk" aria-labelledby="produk-heading" className="mt-10 sm:mt-14">
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <hgroup>
              <h2 id="produk-heading" className="text-xl sm:text-3xl font-bold text-[#26321f]">
                Durian Pilihan Favorit
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">Pilih durian sesuai selera dan kebutuhanmu.</p>
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

          {/* Responsive Product Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-0 m-0 list-none">
            {featuredProducts.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>

        {/* Content & Sidebar Section */}
        <section id="tentang" aria-label="Tentang dan Pengiriman" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 sm:mt-14">
          {/* Main Article */}
          <article
            aria-labelledby="tentang-heading"
            className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-8 border border-[#dedbcf] shadow-sm space-y-3 sm:space-y-4"
          >
            <h2 id="tentang-heading" className="text-xl sm:text-2xl font-bold text-[#26321f]">
              Tentang Kebun Keluarga Kami
            </h2>
            <p className="text-xs sm:text-base text-neutral-700 leading-relaxed">
              Kami adalah usaha keluarga di Riau yang memanen dan merawat buah durian pilihan secara langsung dari pohon tua di kebun Kampar dan Siak.
            </p>
            <p className="text-xs sm:text-base text-neutral-700 leading-relaxed">
              Kami memberikan garansi kualitas rasa manis legit, daging tebal, dan pengiriman aman terlindungi hingga ke tangan pelanggan di wilayah Riau.
            </p>
          </article>

          {/* Aside Sidebar */}
          <aside
            aria-labelledby="pengiriman-heading"
            className="lg:col-span-1 bg-white rounded-2xl p-5 sm:p-8 border border-[#dedbcf] shadow-sm space-y-3"
          >
            <h2 id="pengiriman-heading" className="text-lg sm:text-xl font-bold text-[#26321f]">
              Area Pengiriman Utama
            </h2>
            <ul className="space-y-2 p-0 list-none text-xs sm:text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <span role="img" aria-label="Lokasi">📍</span> Pekanbaru (Sameday / Instant)
              </li>
              <li className="flex items-center gap-2">
                <span role="img" aria-label="Lokasi">📍</span> Kampar & Bangkinang
              </li>
              <li className="flex items-center gap-2">
                <span role="img" aria-label="Lokasi">📍</span> Sekitar wilayah Riau lainnya
              </li>
            </ul>
            <p className="text-xs text-neutral-500 italic pt-2">
              *Ketersediaan armada pengiriman khusus buah dapat disesuaikan.
            </p>
          </aside>
        </section>
      </main>

      {/* Footer Landmark */}
      <Footer />
    </>
  );
}
