"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NotifikasiPopUp() {
  const searchParams = useSearchParams();
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    if (searchParams.get("status") === "masuk") {
      setTampil(true);
      const timer = setTimeout(() => {
        setTampil(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!tampil) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#26321f] text-white p-4 rounded-2xl shadow-2xl border border-emerald-700 flex items-center justify-between gap-3 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-600/40 flex items-center justify-center shrink-0 text-emerald-300 font-bold">
          ✓
        </div>
        <div>
          <p className="text-sm font-bold text-white">Berhasil Masuk</p>
          <p className="text-xs text-neutral-300">
            Sesi aktif. Anda masuk sebagai pengelola inventaris kebun.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setTampil(false)}
        aria-label="Tutup notifikasi"
        className="text-neutral-400 hover:text-white text-sm font-bold p-1.5 rounded-lg hover:bg-emerald-900/60 transition-colors cursor-pointer"
      >
        ✕
      </button>
    </aside>
  );
}
