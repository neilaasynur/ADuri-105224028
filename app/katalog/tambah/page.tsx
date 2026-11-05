import type { Metadata } from "next";
import Link from "next/link";
import FormKatalogItem from "@/components/FormKatalogItem";

export const metadata: Metadata = {
  title: "Tambah Item | Katalog ADuri",
  description: "Formulir pendaftaran item varietas baru ke basis data PostgreSQL.",
};

export default function HalamanTambahItem() {
  return (
    <main id="konten" className="mx-auto max-w-3xl p-4 sm:p-8 space-y-6">
      <Link href="/katalog" className="text-xs font-semibold text-[#31572c] hover:underline inline-flex items-center gap-1">
        <span>&larr;</span> Kembali ke Katalog
      </Link>

      <div className="border-b border-[#dedbcf] pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26321f]">
          Tambah Item Varietas Panen Baru
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Data akan disimpan langsung ke tabel <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">Item</code> di PostgreSQL dengan validasi Zod dan constraint unik.
        </p>
      </div>

      <FormKatalogItem />
    </main>
  );
}
