"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Terjadi galat pada sistem:", error);
  }, [error]);

  return (
    <div
      role="alert"
      className="max-w-xl mx-auto px-4 py-16 text-center space-y-6"
    >
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-sm">
        ⚠️
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-red-600 leading-snug">
        ERROR!
        <span className="block text-lg sm:text-xl font-bold text-[#26321f] mt-1.5">
          Ada kesalahan yang terjadi
        </span>
      </h1>

      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
        Mohon maaf atas ketidaknyamanannya. Sistem kami mendeteksi kendala saat memuat permintaan Anda.
      </p>

      {error.digest && (
        <p className="text-xs font-mono text-neutral-500 bg-neutral-100 p-2 rounded-lg max-w-xs mx-auto border border-neutral-200">
          Kode Digest: {error.digest}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 bg-[#31572c] hover:bg-[#254322] text-white font-bold rounded-xl transition-colors shadow-sm min-h-[44px] cursor-pointer"
        >
          Coba Muat Ulang
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white hover:bg-neutral-100 text-[#31572c] border border-[#31572c] font-bold rounded-xl transition-colors min-h-[44px] flex items-center justify-center"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
