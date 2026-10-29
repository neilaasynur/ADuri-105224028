import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import PaymentForm from "@/components/features/checkout/PaymentForm";

export const metadata: Metadata = {
  title: "Formulir Pemesanan & Pembayaran | ADuri Kebun Durian Riau",
  description: "Formulir pemesanan resmi buah durian segar langsung dari Kebun Keluarga Asynur di Riau.",
};

interface PaymentPageProps {
  searchParams: Promise<{ produk?: string }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const resolved = await searchParams;
  const productKey = resolved?.produk || "default";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Breadcrumb */}
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
              Katalog
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li className="font-bold text-[#26321f]" aria-current="page">
            Pembayaran & Pesanan
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-[#dedbcf] pb-4 space-y-1">
        <mark className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#fff3b8] text-[#624d00]">
          PEMBAYARAN RESMI
        </mark>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26321f]">
          Formulir Pemesanan & Pembayaran Durian
        </h1>
        <p className="text-xs sm:text-base text-neutral-600">
          Lengkapi data penerima dan pilih metode pembayaran resmi untuk buah durian pilihan Anda.
        </p>
      </header>

      {/* Interactive Payment Form: key={productKey} menjamin reset instance baru saat produk berganti */}
      <Suspense fallback={<p className="text-center py-12 text-neutral-600">Memuat formulir pembayaran...</p>}>
        <PaymentForm key={productKey} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
