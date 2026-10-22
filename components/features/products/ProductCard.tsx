import Link from "next/link";
import { ProductCardProps } from "@/types/durian";

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="bg-white border border-[#dedbcf] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      {/* Gambar Buah dalam Figure */}
      <figure className="h-44 sm:h-48 overflow-hidden m-0 relative bg-[#faf8f1] p-3 sm:p-4 flex items-center justify-center border-b border-[#dedbcf]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={`Gambar ${product.name}`}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.isBestSeller && (
          <mark className="absolute top-2.5 right-2.5 bg-amber-400 text-neutral-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            Best Seller
          </mark>
        )}
        <figcaption className="sr-only">Foto {product.name}</figcaption>
      </figure>

      {/* Konten Kartu */}
      <header className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-4">
        <hgroup className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-[#26321f] leading-snug">
            <Link
              href={`/produk/${product.slug}`}
              className="hover:text-[#31572c] transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-700 rounded"
            >
              {product.name}
            </Link>
          </h3>
          <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">{product.tagline}</p>
        </hgroup>

        <section className="space-y-3 pt-2 border-t border-neutral-100">
          <p className="font-bold text-[#31572c] text-lg sm:text-xl m-0 flex items-baseline justify-between">
            <span>{product.priceFormatted}</span>
            <span className="text-xs text-neutral-500 font-normal">/ {product.unit}</span>
          </p>

          <p className="m-0">
            <Link
              href={`/produk/${product.slug}`}
              className="flex items-center justify-center w-full py-3 px-4 bg-[#e9f1d5] hover:bg-[#31572c] text-[#26321f] hover:text-white font-bold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 text-sm shadow-sm min-h-[44px]"
            >
              Lihat Detail & Pesan
            </Link>
          </p>
        </section>
      </header>
    </article>
  );
}
