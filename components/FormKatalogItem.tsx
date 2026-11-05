"use client";

import { useActionState } from "react";
import Link from "next/link";
import { tambahItem } from "@/app/katalog/actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};

export default function FormKatalogItem() {
  const [status, aksi, pending] = useActionState(tambahItem, awal);
  const g = status.galat;

  return (
    <form action={aksi} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#dedbcf] shadow-sm">
      {status.pesan && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 font-semibold"
        >
          {status.pesan}
        </div>
      )}

      {/* Kolom 1: Judul */}
      <div>
        <label htmlFor="judul" className="block text-xs sm:text-sm font-bold text-[#26321f]">
          Nama / Judul Item <span className="text-red-500">*</span>:
        </label>
        <input
          id="judul"
          name="judul"
          type="text"
          placeholder="Contoh: Durian Tembaga Kampar Super"
          className={`mt-1.5 block w-full rounded-xl border border-[#dedbcf] bg-[#faf8f1] px-3.5 py-2.5 text-sm text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c] ${
            g?.judul ? "border-red-500 bg-red-50/40" : ""
          }`}
        />
        {g?.judul && (
          <p id="galat-judul" className="mt-1 text-xs text-red-600 font-medium">
            ⚠️ {g.judul[0]}
          </p>
        )}
      </div>

      {/* Kolom 2: Kategori */}
      <div>
        <label htmlFor="kategori" className="block text-xs sm:text-sm font-bold text-[#26321f]">
          Kategori Item <span className="text-red-500">*</span>:
        </label>
        <select
          id="kategori"
          name="kategori"
          defaultValue="unggulan"
          className="mt-1.5 block w-full rounded-xl border border-[#dedbcf] bg-[#faf8f1] px-3.5 py-2.5 text-sm text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c]"
        >
          <option value="lokal">lokal</option>
          <option value="unggulan">unggulan</option>
          <option value="premium">premium</option>
          <option value="energi">energi</option>
          <option value="lingkungan">lingkungan</option>
          <option value="kampus">kampus</option>
        </select>
        {g?.kategori && (
          <p className="mt-1 text-xs text-red-600 font-medium">⚠️ {g.kategori[0]}</p>
        )}
      </div>

      {/* Kolom 3: Deskripsi */}
      <div>
        <label htmlFor="deskripsi" className="block text-xs sm:text-sm font-bold text-[#26321f]">
          Deskripsi Lengkap <span className="text-red-500">*</span>:
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={4}
          placeholder="Tuliskan deskripsi cita rasa, aroma, karakter buah..."
          className={`mt-1.5 block w-full rounded-xl border border-[#dedbcf] bg-[#faf8f1] px-3.5 py-2.5 text-sm text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c] ${
            g?.deskripsi ? "border-red-500 bg-red-50/40" : ""
          }`}
        />
        {g?.deskripsi && (
          <p className="mt-1 text-xs text-red-600 font-medium">⚠️ {g.deskripsi[0]}</p>
        )}
      </div>

      {/* Kolom 4: Ketersediaan */}
      <div className="flex items-center gap-3">
        <input
          id="tersedia"
          name="tersedia"
          type="checkbox"
          defaultChecked
          className="h-4 w-4 rounded border-neutral-300 text-[#31572c] focus:ring-[#31572c]"
        />
        <label htmlFor="tersedia" className="text-xs sm:text-sm text-neutral-700">
          Tersedia untuk dipesan di kebun
        </label>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-[#dedbcf]">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[#31572c] px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-[#26321f] disabled:opacity-50 transition-colors"
        >
          {pending ? "Menyimpan Item..." : "Simpan Item"}
        </button>
        <Link href="/katalog" className="text-xs font-semibold text-neutral-500 hover:underline">
          Batal
        </Link>
      </div>
    </form>
  );
}
