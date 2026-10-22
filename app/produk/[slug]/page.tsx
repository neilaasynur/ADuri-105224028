import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGallery from "@/components/features/products/ProductGallery";
import ProductSpecification from "@/components/features/products/ProductSpecification";
import { cariProduk, ambilSemuaProduk } from "@/lib/data";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = ambilSemuaProduk();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: DetailPageProps) {
  const { slug } = await params;
  const product = cariProduk(slug);
  if (!product) return { title: "Durian Tidak Ditemukan" };
  return {
    title: `${product.name} — ADuri Riau`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;

  // Validasi format slug: hanya huruf kecil, angka, dan tanda hubung
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    notFound();
  }

  const product = cariProduk(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
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

      {/* Main Product Details Section */}
      <section
        aria-labelledby="product-title"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start"
      >
        {/* Kolom Kiri: Galeri Foto */}
        <section aria-label="Galeri Foto Durian">
          <ProductGallery
            image={product.image}
            name={product.name}
            isBestSeller={product.isBestSeller}
          />
        </section>

        {/* Kolom Kanan: Detail Informasi & Checkout */}
        <article className="space-y-4 sm:space-y-6">
          <header className="space-y-2">
            <h1 id="product-title" className="text-2xl sm:text-4xl font-extrabold text-[#26321f]">
              {product.name}
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {product.tagline}
            </p>
          </header>

          {/* Harga Durian */}
          <section className="bg-white border border-[#dedbcf] rounded-xl p-4 sm:p-5 flex items-baseline justify-between shadow-sm">
            <div>
              <p className="text-xs text-neutral-500 font-medium m-0">Harga Panen Hari Ini:</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#31572c] m-0">
                {product.priceFormatted}
                <span className="text-sm font-normal text-neutral-500"> / {product.unit}</span>
              </p>
            </div>
            <mark className="text-xs font-bold text-[#31572c] bg-[#e9f1d5] px-3 py-1.5 rounded-full">
              Garansi Rasa Manis
            </mark>
          </section>

          {/* Deskripsi Buah */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-[#26321f]">Deskripsi Rasa</h2>
            <p className="text-xs sm:text-base text-neutral-700 leading-relaxed">
              {product.description}
            </p>
          </section>

          {/* Keunggulan Buah */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-[#26321f]">Keunggulan Panen</h2>
            <ul className="text-xs sm:text-sm text-neutral-700 space-y-1.5 p-0 list-none">
              {product.details.map((detail, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-[#31572c] font-bold">✓</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Komponen Spesifikasi Tingkat Rasa */}
          <ProductSpecification
            origin={product.origin}
            weightRange={product.weightRange}
            sweetness={product.sweetness}
            creaminess={product.creaminess}
          />

          {/* Tombol Aksi Pesan */}
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
    </div>
  );
}
