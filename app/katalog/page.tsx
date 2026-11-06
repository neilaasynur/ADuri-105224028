import type { Metadata } from "next";
import { connection } from "next/server";
import Bagian from "@/components/Bagian";
import DaftarItem from "@/components/DaftarItem";
import { ambilDaftarItem } from "@/lib/data";

export const metadata: Metadata = {
  title: "Katalog | ADuri Kebun Durian Riau",
  description: "Daftar katalog varietas durian panen kebun keluarga Asynur berbasis PostgreSQL dan Prisma ORM 7.",
};

export default async function HalamanKatalog() {
  await connection();
  const items = await ambilDaftarItem();

  return (
    <main id="konten" className="mx-auto max-w-6xl p-4 sm:p-8">
      <div className="border-b border-[#dedbcf] pb-4 mb-6">
        <h1 className="text-3xl font-extrabold text-[#26321f]">Katalog Varietas Durian</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Inventaris panen durian Kampar & Pekanbaru yang tersimpan langsung di basis data PostgreSQL.
        </p>
      </div>
      <Bagian id="daftar" judul="Daftar Item">
        <DaftarItem items={items} />
      </Bagian>
    </main>
  );
}
