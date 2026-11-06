"use client";

import { useActionState } from "react";
import { tambahUlasan } from "@/app/katalog/ulasan-actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};

export default function FormUlasan({ itemId }: { itemId: number }) {
  const [status, aksi, pending] = useActionState(
    tambahUlasan.bind(null, itemId),
    awal
  );
  const g = status.galat;

  return (
    <form action={aksi} className="mt-8 space-y-4 rounded-2xl border border-[#dedbcf] bg-[#faf8f1] p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#26321f]">Tambah Ulasan Pembeli</h3>

      {status.pesan && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs sm:text-sm font-semibold text-emerald-900"
        >
          {status.pesan}
        </div>
      )}

      {/* Kolom Nama */}
      <div>
        <label htmlFor="nama" className="block text-xs sm:text-sm font-semibold text-[#26321f]">
          Nama Pengulas <span className="text-red-500">*</span>
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          required
          minLength={2}
          maxLength={60}
          placeholder="Contoh: Budi Santoso"
          className="mt-1 block w-full rounded-xl border border-[#dedbcf] bg-white px-3 py-2 text-sm text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c]"
        />
        {g?.nama && (
          <p className="mt-1 text-xs text-red-600 font-medium">⚠️ {g.nama[0]}</p>
        )}
      </div>

      {/* Kolom Nilai Rating (1-5) */}
      <div>
        <label htmlFor="nilai" className="block text-xs sm:text-sm font-semibold text-[#26321f]">
          Nilai Rating (1 - 5) <span className="text-red-500">*</span>
        </label>
        <input
          id="nilai"
          name="nilai"
          type="number"
          required
          min={1}
          max={5}
          defaultValue={5}
          className="mt-1 block w-full rounded-xl border border-[#dedbcf] bg-white px-3 py-2 text-sm text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c]"
        />
        {g?.nilai && (
          <p className="mt-1 text-xs text-red-600 font-medium">⚠️ {g.nilai[0]}</p>
        )}
      </div>

      {/* Kolom Komentar */}
      <div>
        <label htmlFor="komentar" className="block text-xs sm:text-sm font-semibold text-[#26321f]">
          Komentar Ulasan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="komentar"
          name="komentar"
          required
          minLength={5}
          maxLength={500}
          rows={3}
          placeholder="Tuliskan pengalaman rasa, kelembutan daging buah, dan aroma durian..."
          className="mt-1 block w-full rounded-xl border border-[#dedbcf] bg-white px-3 py-2 text-sm text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c]"
        />
        {g?.komentar && (
          <p className="mt-1 text-xs text-red-600 font-medium">⚠️ {g.komentar[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-[#31572c] px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-[#26321f] disabled:opacity-50 transition-colors"
      >
        {pending ? "Menyimpan Ulasan..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}
