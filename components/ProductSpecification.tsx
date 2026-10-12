interface ProductSpecificationProps {
  origin: string;
  weightRange: string;
  sweetness: number;
  creaminess: number;
}

export default function ProductSpecification({
  origin,
  weightRange,
  sweetness,
  creaminess
}: ProductSpecificationProps) {
  return (
    <section className="space-y-3 bg-[#e9f1d5]/50 border border-[#d3e2b1] p-4 sm:p-5 rounded-xl">
      <h2 className="text-sm sm:text-base font-bold text-[#26321f]">Karakteristik & Spesifikasi</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm m-0">
        <section>
          <dt className="text-neutral-500 font-medium">Asal Kebun:</dt>
          <dd className="font-bold text-[#26321f] m-0">{origin}</dd>
        </section>
        <section>
          <dt className="text-neutral-500 font-medium">Estimasi Berat:</dt>
          <dd className="font-bold text-[#26321f] m-0">{weightRange}</dd>
        </section>
        <section>
          <dt className="text-neutral-500 font-medium">Tingkat Kemanisan:</dt>
          <dd className="font-bold text-[#26321f] m-0">{"★".repeat(sweetness)} ({sweetness}/5)</dd>
        </section>
        <section>
          <dt className="text-neutral-500 font-medium">Ke-creamy-an Daging:</dt>
          <dd className="font-bold text-[#26321f] m-0">{"★".repeat(creaminess)} ({creaminess}/5)</dd>
        </section>
      </dl>
    </section>
  );
}

