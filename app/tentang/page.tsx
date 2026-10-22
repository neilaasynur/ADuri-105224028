import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang Kami | ADuri Kebun Durian Riau",
  description: "Mengenal dedikasi kebun keluarga Asynur dalam merawat dan membudidayakan durian unggulan di Riau.",
};

export default function HalamanTentang() {
  return (
    <main id="konten" className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-neutral-600">
        <ol className="flex items-center gap-2 list-none p-0 m-0">
          <li>
            <Link href="/" className="hover:text-[#31572c] underline">
              Beranda
            </Link>
          </li>
          <li>/</li>
          <li className="font-semibold text-[#26321f]">Tentang Kami</li>
        </ol>
      </nav>

      <header className="border-b border-[#dedbcf] pb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#26321f]">
          Tentang Kebun ADuri 🌿
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600">
          Mengenal dedikasi keluarga Asynur dalam membudidayakan durian unggul lokal dan nusantara di tanah Riau.
        </p>
      </header>

      <section className="space-y-4 text-neutral-700 leading-relaxed text-sm sm:text-base">
        <p>
          Kebun Durian ADuri berawal dari komitmen keluarga Asynur di Riau untuk menghadirkan buah durian dengan standar kualitas terbaik: matang pohon alami, garansi keaslian rasa, dan bebas dari pematangan karbit.
        </p>
        <p>
          Kami memadukan kearifan lokal dalam merawat pohon durian tua varietas lokal Kampar dengan teknik budidaya modern untuk varietas unggulan seperti Montong, Musang King, dan Duri Hitam. Setiap butir buah diseleksi secara ketat demi kepuasan pelanggan.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="bg-white p-5 rounded-2xl border border-[#dedbcf] shadow-sm">
          <h3 className="font-bold text-[#31572c] mb-1">🌿 100% Matang Alami</h3>
          <p className="text-xs text-neutral-600">
            Dipetik dan dikumpulkan saat jatuhan pohon untuk aroma dan rasa manis gurih optimal.
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#dedbcf] shadow-sm">
          <h3 className="font-bold text-[#31572c] mb-1">🛡️ Garansi Ganti Buah</h3>
          <p className="text-xs text-neutral-600">
            Garansi penggantian jika buah mentah, busuk, atau hambar saat diterima.
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#dedbcf] shadow-sm">
          <h3 className="font-bold text-[#31572c] mb-1">📍 Wisata Kebun Langsung</h3>
          <p className="text-xs text-neutral-600">
            Menyambut kunjungan langsung keluarga untuk memilih dan mencicipi buah di bawah pohon.
          </p>
        </div>
      </div>
    </main>
  );
}
