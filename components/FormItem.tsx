"use client";

import { useActionState } from "react";
import { simpanItem } from "@/app/produk/actions";
import type { StatusForm } from "@/schema/status-form";

const awal: StatusForm = {};
const kolomInput =
  "mt-1.5 block w-full rounded-xl border border-[#dedbcf] bg-[#faf8f1] px-3.5 py-2.5 text-sm text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c] transition-colors min-h-[44px]";

export default function FormItem() {
  const [status, aksi, pending] = useActionState(simpanItem, awal);
  const g = status.galat;
  const n = status.nilai;

  return (
    <form action={aksi} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#dedbcf] shadow-sm">
      {status.pesan && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 font-semibold flex items-center gap-2"
        >
          <span>ℹ️</span>
          <span>{status.pesan}</span>
        </div>
      )}

      {/* Kolom 1: Judul / Nama Varietas */}
      <div>
        <label htmlFor="judul" className="block text-xs sm:text-sm font-bold text-[#26321f]">
          Nama Varietas Durian <span className="text-red-500">*</span>:
        </label>
        <input
          id="judul"
          name="judul"
          type="text"
          required
          minLength={3}
          maxLength={80}
          defaultValue={n?.judul}
          placeholder="Contoh: Durian Tembaga Kampar Super"
          className={`${kolomInput} ${g?.judul ? "border-red-500 bg-red-50/40" : ""}`}
          aria-invalid={!!g?.judul}
          aria-describedby="galat-judul"
        />
        {g?.judul && (
          <p id="galat-judul" className="mt-1 text-xs text-red-600 font-medium">
            ⚠️ {g.judul[0]}
          </p>
        )}
      </div>

      {/* Kolom 2: Kategori Varietas (Select dengan key agar nilai tetap tersimpan saat render ulang) */}
      <div>
        <label htmlFor="kategori" className="block text-xs sm:text-sm font-bold text-[#26321f]">
          Kategori Varietas <span className="text-red-500">*</span>:
        </label>
        <select
          id="kategori"
          name="kategori"
          required
          key={n?.kategori ?? "awal"}
          defaultValue={n?.kategori ?? ""}
          className={`${kolomInput} ${g?.kategori ? "border-red-500 bg-red-50/40" : ""}`}
          aria-invalid={!!g?.kategori}
          aria-describedby="galat-kategori"
        >
          <option value="" disabled>-- Pilih Kategori Varietas --</option>
          <option value="lokal">Varietas Lokal Riau</option>
          <option value="unggulan">Varietas Unggulan Nasional</option>
          <option value="premium">Varietas Super Premium</option>
        </select>
        {g?.kategori && (
          <p id="galat-kategori" className="mt-1 text-xs text-red-600 font-medium">
            ⚠️ {g.kategori[0]}
          </p>
        )}
      </div>

      {/* Kolom 3: Harga Panen per Kilogram */}
      <div>
        <label htmlFor="harga" className="block text-xs sm:text-sm font-bold text-[#26321f]">
          Harga Panen per Kg (IDR) <span className="text-red-500">*</span>:
        </label>
        <input
          id="harga"
          name="harga"
          type="number"
          required
          min={10000}
          max={1000000}
          defaultValue={n?.harga ?? "50000"}
          className={`${kolomInput} ${g?.harga ? "border-red-500 bg-red-50/40" : ""}`}
          aria-invalid={!!g?.harga}
          aria-describedby="galat-harga"
        />
        {g?.harga && (
          <p id="galat-harga" className="mt-1 text-xs text-red-600 font-medium">
            ⚠️ {g.harga[0]}
          </p>
        )}
      </div>

      {/* Kolom 4: Deskripsi Karakteristik & Rasa */}
      <div>
        <label htmlFor="deskripsi" className="block text-xs sm:text-sm font-bold text-[#26321f]">
          Deskripsi Cita Rasa & Ciri Khas <span className="text-red-500">*</span>:
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          required
          minLength={10}
          maxLength={300}
          rows={4}
          defaultValue={n?.deskripsi}
          placeholder="Jelaskan aroma, tekstur daging (creamy/kering), rasa manis gurih/pahit..."
          className={`${kolomInput} ${g?.deskripsi ? "border-red-500 bg-red-50/40" : ""}`}
          aria-invalid={!!g?.deskripsi}
          aria-describedby="galat-deskripsi"
        />
        {g?.deskripsi && (
          <p id="galat-deskripsi" className="mt-1 text-xs text-red-600 font-medium">
            ⚠️ {g.deskripsi[0]}
          </p>
        )}
      </div>

      {/* Kolom 5: Status Ketersediaan Panen */}
      <div className="pt-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="tersedia"
            defaultChecked
            className="w-5 h-5 rounded border-[#dedbcf] text-[#31572c] focus:ring-[#31572c] accent-[#31572c]"
          />
          <span className="text-xs sm:text-sm font-semibold text-[#26321f]">
            Status Siap Panen (Langsung tampil aktif di katalog web)
          </span>
        </label>
      </div>

      {/* Tombol Simpan dengan Status Pending */}
      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 px-6 bg-[#31572c] hover:bg-[#254322] active:bg-[#1a3018] text-white font-extrabold text-base rounded-xl shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-emerald-700/50 disabled:opacity-60 min-h-[48px] cursor-pointer"
      >
        {pending ? "Menyimpan Varietas Durian..." : "Simpan & Publikasikan ke Katalog"}
      </button>
    </form>
  );
}
