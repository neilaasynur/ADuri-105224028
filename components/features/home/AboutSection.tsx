export default function AboutSection() {
  return (
    <section id="tentang" aria-label="Tentang dan Pengiriman" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 sm:mt-14">
      {/* Main Article */}
      <article
        aria-labelledby="tentang-heading"
        className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-8 border border-[#dedbcf] shadow-sm space-y-3 sm:space-y-4"
      >
        <h2 id="tentang-heading" className="text-xl sm:text-2xl font-bold text-[#26321f]">
          Tentang Kebun Keluarga Kami
        </h2>
        <p className="text-xs sm:text-base text-neutral-700 leading-relaxed">
          Kami adalah usaha keluarga di Riau yang memanen dan merawat buah durian pilihan secara langsung dari pohon tua di kebun Kampar dan Siak.
        </p>
        <p className="text-xs sm:text-base text-neutral-700 leading-relaxed">
          Kami memberikan garansi kualitas rasa manis legit, daging tebal, dan pengiriman aman terlindungi hingga ke tangan pelanggan di wilayah Riau.
        </p>
      </article>

      {/* Aside Sidebar */}
      <aside
        aria-labelledby="pengiriman-heading"
        className="lg:col-span-1 bg-white rounded-2xl p-5 sm:p-8 border border-[#dedbcf] shadow-sm space-y-3"
      >
        <h2 id="pengiriman-heading" className="text-lg sm:text-xl font-bold text-[#26321f]">
          Area Pengiriman Utama
        </h2>
        <ul className="space-y-2 p-0 list-none text-xs sm:text-sm text-neutral-700">
          <li className="flex items-center gap-2">
            <span role="img" aria-label="Lokasi">📍</span> Pekanbaru (Sameday / Instant)
          </li>
          <li className="flex items-center gap-2">
            <span role="img" aria-label="Lokasi">📍</span> Kampar & Bangkinang
          </li>
          <li className="flex items-center gap-2">
            <span role="img" aria-label="Lokasi">📍</span> Sekitar wilayah Riau lainnya
          </li>
        </ul>
        <p className="text-xs text-neutral-500 italic pt-2">
          *Ketersediaan armada pengiriman khusus buah dapat disesuaikan.
        </p>
      </aside>
    </section>
  );
}
