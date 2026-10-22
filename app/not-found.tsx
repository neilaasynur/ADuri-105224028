import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="text-6xl">🍈</div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-[#26321f]">
        Varietas Durian Tidak Ditemukan (404)
      </h1>
      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
        Halaman atau varietas durian yang Anda tuju tidak terdaftar di kebun keluarga Asynur. Silakan cek daftar varietas yang sedang panen pada katalog kami.
      </p>
      <div className="pt-2">
        <Link
          href="/produk"
          className="inline-flex items-center justify-center px-6 py-3.5 bg-[#31572c] hover:bg-[#254322] text-white font-bold rounded-xl transition-colors shadow-md min-h-[44px]"
        >
          Lihat Katalog Durian Lengkap &rarr;
        </Link>
      </div>
    </div>
  );
}
