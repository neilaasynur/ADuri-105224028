import Link from "next/link";
import type { Item } from "@/lib/tipe";

interface DaftarItemProps {
  items: Item[];
}

export default function DaftarItem({ items }: DaftarItemProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#dedbcf] p-8 text-center text-neutral-500">
        <p>Belum ada item di katalog.</p>
        <Link
          href="/katalog/tambah"
          className="mt-3 inline-block rounded-lg bg-[#31572c] px-4 py-2 text-sm text-white font-semibold hover:bg-[#26321f]"
        >
          + Tambah Item Pertama
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-600">Total: {items.length} varietas panen aktif</p>
        <Link
          href="/katalog/tambah"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#31572c] px-4 py-2 text-sm text-white font-semibold shadow hover:bg-[#26321f] transition-colors"
        >
          <span>+</span>
          <span>Tambah Varietas Panen</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-[#dedbcf] bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                  {item.kategori}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    item.tersedia
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {item.tersedia ? "Tersedia" : "Habis"}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#26321f]">
                <Link href={`/katalog/${item.id}`} className="hover:text-[#31572c] underline">
                  {item.judul}
                </Link>
              </h3>

              <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
                {item.deskripsi}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-[#f0eee6] flex items-center justify-between">
              <span className="text-xs text-neutral-400">ID #{item.id}</span>
              <Link
                href={`/katalog/${item.id}`}
                className="text-xs font-semibold text-[#31572c] hover:underline"
              >
                Lihat Detail & Ulasan &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
