import { notFound } from "next/navigation";
import Link from "next/link";
import { ambilItem } from "@/lib/data";
import FormUbahItem from "@/components/FormUbahItem";

export default async function HalamanUbahItem({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const item = await ambilItem(id);
  if (!item) notFound();

  return (
    <main id="konten" className="mx-auto max-w-3xl p-4 sm:p-8 space-y-6">
      <Link
        href={`/katalog/${item.id}`}
        className="text-xs font-semibold text-[#31572c] hover:underline inline-flex items-center gap-1"
      >
        <span>&larr;</span> Kembali ke Detail Item
      </Link>

      <div className="border-b border-[#dedbcf] pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26321f]">
          Ubah Data Varietas: {item.judul}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Perubahan akan disimpan langsung ke PostgreSQL menggunakan Server Action <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">ubahItem</code>.
        </p>
      </div>

      <FormUbahItem item={item} />
    </main>
  );
}
