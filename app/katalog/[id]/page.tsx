import { notFound } from "next/navigation";
import Link from "next/link";
import { ambilItem } from "@/lib/data";
import { hapusItem } from "@/app/katalog/actions";
import { hapusUlasan } from "@/app/katalog/ulasan-actions";
import FormUlasan from "@/components/FormUlasan";

export default async function DetailItem({
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
      <Link href="/katalog" className="text-xs font-semibold text-[#31572c] hover:underline inline-flex items-center gap-1">
        <span>&larr;</span> Kembali ke Katalog
      </Link>

      <div className="flex justify-between items-start gap-4 border-b border-[#dedbcf] pb-4">
        <div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            {item.kategori}
          </span>
          <h1 className="text-3xl font-extrabold text-[#26321f] mt-2">{item.judul}</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Status: <span className="font-semibold text-emerald-700">{item.tersedia ? "Tersedia di Kebun" : "Habis"}</span>
          </p>
        </div>
        <Link
          href={`/katalog/${item.id}/ubah`}
          className="rounded-xl border border-[#31572c] px-3.5 py-2 text-xs font-bold text-[#31572c] hover:bg-[#31572c] hover:text-white transition-colors"
        >
          Ubah Item
        </Link>
      </div>

      <div className="rounded-2xl border border-[#dedbcf] bg-[#faf8f1] p-5">
        <h2 className="text-xs font-bold text-[#31572c] uppercase tracking-wide mb-1">Deskripsi Varietas:</h2>
        <p className="text-sm text-neutral-700 leading-relaxed">{item.deskripsi}</p>
      </div>

      {/* Daftar Ulasan */}
      <div>
        <h2 className="text-xl font-bold text-[#26321f]">
          Ulasan Pembeli ({item.ulasan.length})
        </h2>

        {item.ulasan.length === 0 ? (
          <p className="mt-3 text-xs text-neutral-500 italic">Belum ada ulasan untuk varietas ini.</p>
        ) : (
          <ul className="mt-4 space-y-3 list-none p-0">
            {item.ulasan.map((u) => (
              <li key={u.id} className="rounded-xl border border-[#dedbcf] bg-white p-4 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold text-sm text-[#26321f]">
                    {u.nama} <span className="text-amber-500 font-normal">· ⭐ {u.nilai}/5</span>
                  </p>
                  <form action={hapusUlasan.bind(null, u.id, item.id)}>
                    <button type="submit" className="text-xs text-red-600 hover:text-red-800 underline font-medium">
                      Hapus ulasan
                    </button>
                  </form>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600">{u.komentar}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulir Tambah Ulasan */}
      <FormUlasan itemId={item.id} />

      {/* Tombol Hapus Item */}
      <div className="pt-6 border-t border-[#dedbcf]">
        <form action={hapusItem.bind(null, item.id)}>
          <button
            type="submit"
            className="rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white shadow hover:bg-red-800 transition-colors"
          >
            Hapus item
          </button>
        </form>
      </div>
    </main>
  );
}
