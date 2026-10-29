import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import FormItem from "@/components/FormItem";
import { bacaSesi } from "@/schema/sesi";

export const metadata: Metadata = {
  title: "Tambah Varietas Durian | ADuri Kebun Durian Riau",
  description: "Formulir pendaftaran hasil panen varietas durian baru untuk katalog Kebun ADuri.",
};

export default async function HalamanTambahKatalog() {
  const sesi = await bacaSesi();
  if (!sesi) {
    redirect("/masuk");
  }

  return (
    <main id="konten" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-500">
        <ol className="flex items-center gap-2 list-none p-0 m-0">
          <li>
            <Link href="/" className="hover:text-[#31572c] underline">
              Beranda
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/produk" className="hover:text-[#31572c] underline">
              Katalog
            </Link>
          </li>
          <li>/</li>
          <li className="font-semibold text-[#26321f]">Tambah Varietas Panen</li>
        </ol>
      </nav>

      {/* Header Halaman (Tombol Logout sudah dipindah ke Navbar agar tidak double) */}
      <header className="border-b border-[#dedbcf] pb-4 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26321f]">
          Tambah Varietas Durian Panen Baru
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600">
          Masuk sebagai: <strong className="text-[#31572c]">{sesi.email}</strong>
        </p>
      </header>

      {/* Formulir Tambah Durian */}
      <FormItem />
    </main>
  );
}
