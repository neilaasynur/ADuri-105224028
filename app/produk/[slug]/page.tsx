import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import ProductSpecification from "@/components/ProductSpecification";
import { DURIAN_PRODUCTS } from "@/data/products";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DURIAN_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: DetailPageProps) {
  const { slug } = await params;
  const product = DURIAN_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Durian Tidak Ditemukan" };
  return {
    title: `${product.name} — Durian Riau`,
    description: product.description
  };
}

export default async function ProductDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const product = DURIAN_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-amber-400 focus:text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800"
      >
        Lompati ke konten utama
      </a>

      <Navbar currentPath="/produk" />

      <main id="main-content" tabIndex={-1} className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 outline-none space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-neutral-600 m-0 p-0 list-none">
            <li>
              <Link href="/" className="hover:underline hover:text-[#31572c]">
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link href="/produk" className="hover:underline hover:text-[#31572c]">
                Katalog Durian
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-bold text-[#26321f]" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Overview Layout */}
        <section aria-labelledby="product-title" className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Product Gallery Component */}
          <ProductGallery
            image={product.image}
            name={product.name}
            isBestSeller={product.isBestSeller}
          />

          {/* Product Details & Order CTA */}
          <article className="space-y-5 sm:space-y-6">
            <header className="space-y-2 border-b border-[#dedbcf] pb-4 sm:pb-5">
              <span className="text-xs font-bold text-[#624d00] bg-[#fff3b8] px-3 py-1 rounded-full inline-block">
                ASLI {product.origin.toUpperCase()}
              </span>
              <h1 id="product-title" className="text-2xl sm:text-4xl font-extrabold text-[#26321f]">
                {product.name}
              </h1>
              <p className="text-neutral-600 text-sm sm:text-base italic">{product.tagline}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#31572c] pt-2 m-0">
                {product.priceFormatted} <span className="text-xs sm:text-sm font-normal text-neutral-600">/ {product.unit}</span>
              </p>
            </header>

            {/* Description */}
            <section className="space-y-2 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#26321f]">Deskripsi Produk</h2>
              <p className="text-xs sm:text-base text-neutral-700 leading-relaxed">{product.description}</p>
            </section>

            {/* Product Specification Component */}
            <ProductSpecification
              origin={product.origin}
              weightRange={product.weightRange}
              sweetness={product.sweetness}
              creaminess={product.creaminess}
            />

            {/* Product Highlights */}
            <section className="space-y-2">
              <h2 className="text-sm sm:text-base font-bold text-[#26321f]">Jaminan Kualitas:</h2>
              <ul className="list-disc list-inside text-xs sm:text-sm text-neutral-700 space-y-1 p-0 m-0">
                {product.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </section>

            {/* Action Buttons */}
            <footer className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/pembayaran?produk=${product.slug}`}
                className="flex items-center justify-center flex-1 py-3.5 px-6 bg-[#31572c] hover:bg-[#254322] text-white font-bold text-base sm:text-lg rounded-xl shadow-md transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-700/50 min-h-[44px]"
              >
                Lanjut ke Pembayaran &rarr;
              </Link>
              <Link
                href="/produk"
                className="flex items-center justify-center py-3.5 px-6 bg-white hover:bg-neutral-100 text-neutral-700 border border-[#dedbcf] font-bold text-center rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 min-h-[44px]"
              >
                Kembali ke Katalog
              </Link>
            </footer>
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
