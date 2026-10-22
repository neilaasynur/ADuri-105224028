"use client";

export default function GalatUji({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto p-8">
      <div role="alert" className="space-y-4 p-6 bg-red-50 border border-red-200 rounded-2xl text-center sm:text-left">
        <h2 className="text-2xl font-black text-red-600 leading-snug">
          ERROR!
          <span className="block text-lg font-bold text-red-900 mt-1">
            Ada kesalahan yang terjadi
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-red-700 m-0">
          <strong>Detail Pesan:</strong> {error.message}
        </p>

        {error.digest && (
          <p className="text-xs font-mono text-red-600 bg-white/70 p-2 rounded-lg border border-red-200 m-0">
            Kode Digest (Server Log): {error.digest}
          </p>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 text-sm transition-colors cursor-pointer shadow-sm min-h-[44px]"
          >
            Coba lagi (Retry)
          </button>
        </div>
      </div>
    </div>
  );
}
