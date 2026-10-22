import Link from "next/link";

export default function DurianTidakDitemukan() {
  return (
    <main
      id="konten"
      className="bg-white border border-[#dedbcf] rounded-2xl p-8 text-center space-y-4 max-w-xl mx-auto my-8 shadow-sm"
    >
      <span className="text-5xl block" role="img" aria-label="Durian tidak ditemukan">
        🍃
      </span>
      <h1 className="text-2xl font-bold text-[#26321f]">Varietas Durian Tidak Ditemukan</h1>
      <p className="text-sm text-neutral-600">
        Mohon periksa kembali nama/slug durian pada alamat URL Anda atau pilih varian buah yang tersedia di katalog.
      </p>
      <Link
        href="/produk"
        className="inline-block px-5 py-2.5 bg-[#31572c] hover:bg-[#254322] text-white font-bold rounded-xl transition-colors text-sm"
      >
        Kembali ke Katalog Durian
      </Link>
    </main>
  );
}
