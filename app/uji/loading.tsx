export default function MemuatUji() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-2xl mx-auto p-12 flex flex-col items-center justify-center space-y-4 text-center"
    >
      {/* Slot Logo Durian */}
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-[#e9f1d5] flex items-center justify-center animate-bounce shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/durian.png"
            alt="Logo Durian"
            className="w-9 h-9 object-contain"
          />
        </div>
        <div className="absolute -inset-2 border-2 border-[#31572c] border-t-transparent rounded-full animate-spin" />
      </div>

      <p className="text-base font-bold text-[#26321f] animate-pulse">
        Sedang memproses permintaan Anda...
      </p>
    </div>
  );
}
