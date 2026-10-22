import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 bg-[#e9f1d5] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-[#d3e2b1]"
    >
      <article className="flex-1 space-y-3 text-left w-full">
        <h1
          id="hero-heading"
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#26321f] leading-tight"
        >
          Durian Asli Riau, Langsung dari Kebun Keluarga
        </h1>
        <p className="text-sm sm:text-lg text-neutral-700 leading-relaxed max-w-xl">
          Nikmati durian pilihan dari kebun keluarga. Fokus melayani pelanggan
          di Riau dengan buah segar, garansi rasa manis legit, dan dikirim cepat.
        </p>
        <p className="pt-2 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/produk"
            className="flex items-center justify-center px-5 py-3 bg-[#31572c] hover:bg-[#254322] active:bg-[#1a3018] text-white font-bold rounded-xl transition-colors shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/50 min-h-[44px]"
          >
            Lihat Katalog Durian
          </Link>
          <Link
            href="/ambil-sendiri"
            className="flex items-center justify-center px-5 py-3 bg-amber-400 hover:bg-amber-300 text-[#26321f] font-bold rounded-xl transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 min-h-[44px]"
          >
            Ambil Sendiri di Kebun
          </Link>
          <Link
            href="/pembayaran"
            className="flex items-center justify-center px-5 py-3 bg-white hover:bg-neutral-100 text-[#31572c] border border-[#31572c] font-bold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 min-h-[44px]"
          >
            Pesan Langsung
          </Link>
        </p>
      </article>

      {/* Foto Durian Hero */}
      <figure className="w-full lg:w-[320px] h-48 sm:h-60 lg:h-64 rounded-2xl overflow-hidden shrink-0 m-0 relative bg-white/70 p-3 sm:p-4 flex items-center justify-center shadow-sm border border-[#dedbcf]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/durian.png"
          alt="Buah durian utuh berduri dan dua ulas daging durian matang berwarna kuning manis"
          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
          loading="eager"
        />
        <figcaption className="sr-only">
          Foto durian utuh dan dua ulas daging durian kuning mekar
        </figcaption>
      </figure>
    </section>
  );
}
