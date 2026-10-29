"use client";

import { useActionState } from "react";
import { masuk } from "@/app/masuk/actions";
import type { StatusForm } from "@/schema/status-form";

const awal: StatusForm = {};
const kolomInput =
  "mt-1.5 block w-full rounded-xl border border-[#dedbcf] bg-[#faf8f1] px-3.5 py-2.5 text-sm text-[#26321f] focus:outline-none focus:ring-2 focus:ring-[#31572c] transition-colors min-h-[44px]";

export default function FormMasuk() {
  const [status, aksi, pending] = useActionState(masuk, awal);
  const g = status.galat;

  return (
    <form action={aksi} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#dedbcf] shadow-sm">
      {status.pesan && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 font-semibold flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>{status.pesan}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-[#26321f]">
          Email <span className="text-red-500">*</span>:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="pengelola@aduri.riau"
          className={`${kolomInput} ${g?.email ? "border-red-500 bg-red-50/40" : ""}`}
          aria-invalid={!!g?.email}
          aria-describedby="galat-email"
        />
        {g?.email && (
          <p id="galat-email" className="mt-1 text-xs text-red-600 font-medium">
            ⚠️ {g.email[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="kataSandi" className="block text-xs sm:text-sm font-bold text-[#26321f]">
          Kata Sandi <span className="text-red-500">*</span>:
        </label>
        <input
          id="kataSandi"
          name="kataSandi"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className={`${kolomInput} ${g?.kataSandi ? "border-red-500 bg-red-50/40" : ""}`}
          aria-invalid={!!g?.kataSandi}
          aria-describedby="galat-sandi"
        />
        {g?.kataSandi && (
          <p id="galat-sandi" className="mt-1 text-xs text-red-600 font-medium">
            ⚠️ {g.kataSandi[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3.5 px-6 bg-[#31572c] hover:bg-[#254322] active:bg-[#1a3018] text-white font-bold rounded-xl shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-emerald-700/50 disabled:opacity-60 min-h-[48px] cursor-pointer"
      >
        {pending ? "Memverifikasi..." : "Masuk"}
      </button>
    </form>
  );
}
