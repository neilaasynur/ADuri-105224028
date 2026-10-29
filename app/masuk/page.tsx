import type { Metadata } from "next";
import Link from "next/link";
import FormMasuk from "@/components/FormMasuk";

export const metadata: Metadata = {
  title: "Masuk Akun | ADuri Kebun Durian Riau",
  description: "Akses autentikasi akun pengguna dan pengelola Kebun ADuri.",
};

export default function HalamanMasuk() {
  return (
    <main id="konten" className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-500">
        <ol className="flex items-center gap-2 list-none p-0 m-0">
          <li>
            <Link href="/" className="hover:text-[#31572c] underline">
              Beranda
            </Link>
          </li>
          <li>/</li>
          <li className="font-semibold text-[#26321f]">Masuk</li>
        </ol>
      </nav>

      <header className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26321f]">
          Masuk ke Akun ADuri
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600">
          Silakan masukkan email dan kata sandi Anda untuk melanjutkan.
        </p>
      </header>

      <FormMasuk />
    </main>
  );
}
