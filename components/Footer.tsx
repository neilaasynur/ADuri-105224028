import Link from "next/link";

export default function Footer() {
  return (
    <footer id="kontak" className="mt-12 sm:mt-16 bg-[#26321f] text-white py-8 px-4 sm:px-6">
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-emerald-900/50 pt-4">
        <address className="not-italic space-y-1">
          <strong className="text-base sm:text-lg block text-white">Durian Riau</strong>
          <span className="text-xs sm:text-sm text-neutral-300 block leading-relaxed">
            Usaha Keluarga • Kebun Kampar & Pekanbaru, Riau
          </span>
        </address>
        
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
          <Link
            href="/produk"
            className="inline-flex items-center justify-center text-sm text-amber-200 hover:underline focus:outline-none focus:ring-1 focus:ring-amber-300 min-h-[44px] sm:min-h-0"
          >
            Lihat Semua Durian &rarr;
          </Link>
          <p className="text-sm sm:text-base bg-emerald-950/60 px-4 py-3 sm:py-2.5 rounded-xl border border-emerald-800 m-0 text-center sm:text-left min-h-[44px] flex items-center justify-center">
            <span>WhatsApp:{" "}</span>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-300 font-semibold ml-1"
            >
              0812-3456-7890
            </a>
          </p>
        </section>
      </section>
    </footer>
  );
}
