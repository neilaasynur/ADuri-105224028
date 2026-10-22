import Image from "next/image";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center"
    >
      {/* Slot Logo Durian (Siap diganti dengan logo resmi yang Anda kirim) */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#e9f1d5] flex items-center justify-center animate-bounce shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/durian.png"
            alt="Logo Durian ADuri"
            className="w-10 h-10 object-contain"
          />
        </div>
        {/* Ring animasi spinner halus di sekeliling logo */}
        <div className="absolute -inset-2 border-2 border-[#31572c] border-t-transparent rounded-full animate-spin" />
      </div>

      <p className="text-sm sm:text-base font-bold text-[#26321f] tracking-wide animate-pulse">
        Sedang memproses permintaan Anda...
      </p>
    </div>
  );
}
