"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const QUICK_PRODUCTS = [
  { slug: "durian-kampung", name: "Durian Kampung Riau", badge: "Favorit Lokal" },
  { slug: "durian-montong", name: "Durian Montong Riau", badge: "Super Tebal" },
  { slug: "durian-lokal-riau", name: "Durian Tembaga Riau", badge: "Emas Tembaga" },
  { slug: "durian-musang-king", name: "Durian Musang King", badge: "Premium" },
  { slug: "durian-black-thorn", name: "Durian Duri Hitam", badge: "Langka" },
];

export default function ProductSidebarFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const searchId = useId();

  const filteredProducts = QUICK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside aria-label="Panel filter produk" className="space-y-5">
      {/* Search & Filter Real Feature Card */}
      <section className="bg-white border border-[#dedbcf] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <header className="border-b border-[#dedbcf] pb-2.5">
          <h2 className="font-bold text-sm sm:text-base text-[#26321f] flex items-center gap-2">
            <span>🔍</span> Cari & Filter Durian
          </h2>
          <p className="text-[11px] text-neutral-500 m-0">
            Pencarian dipertahankan selama navigasi (Fitur <code>layout.tsx</code>).
          </p>
        </header>

        {/* Input Search */}
        <div className="space-y-1">
          <label htmlFor={searchId} className="text-xs font-semibold text-neutral-700 block">
            Cari Nama Varietas:
          </label>
          <input
            id={searchId}
            type="text"
            placeholder="Ketik nama varietas (cth: montong)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#dedbcf] bg-[#faf8f1] px-3 py-2 text-xs sm:text-sm text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c]"
          />
        </div>

        {/* Quick List Results */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Akses Cepat Varietas:
          </span>
          <ul className="space-y-1 list-none p-0 m-0 text-xs">
            {filteredProducts.map((p) => {
              const isSelected = pathname === `/produk/${p.slug}`;
              return (
                <li key={p.slug}>
                  <Link
                    href={`/produk/${p.slug}`}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-[#31572c] text-white font-bold"
                        : "hover:bg-[#e9f1d5]/50 text-neutral-700"
                    }`}
                  >
                    <span>{p.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-amber-300 text-neutral-900" : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {p.badge}
                    </span>
                  </Link>
                </li>
              );
            })}
            {filteredProducts.length === 0 && (
              <li className="text-xs text-neutral-400 italic py-2 text-center">
                Tidak ada varian yang cocok
              </li>
            )}
          </ul>
        </div>
      </section>
    </aside>
  );
}
