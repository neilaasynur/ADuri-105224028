interface ProductGalleryProps {
  image: string;
  name: string;
  isBestSeller?: boolean;
}

export default function ProductGallery({ image, name, isBestSeller }: ProductGalleryProps) {
  return (
    <figure className="bg-white border border-[#dedbcf] rounded-2xl p-4 sm:p-8 flex items-center justify-center shadow-sm m-0 relative h-64 sm:h-80 lg:h-96">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={`Foto utama ${name}`} className="max-h-full max-w-full object-contain" />
      {isBestSeller && (
        <mark className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-amber-400 text-neutral-900 font-bold px-2.5 py-1 rounded-full text-xs shadow-sm">
          Rekomendasi Kebun
        </mark>
      )}
      <figcaption className="sr-only">Foto ulas daging {name}</figcaption>
    </figure>
  );
}
