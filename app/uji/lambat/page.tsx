import { connection } from "next/server";

export default async function HalamanLambat() {
  await connection(); // render menunggu permintaan nyata
  await new Promise((selesai) => setTimeout(selesai, 2000));

  return (
    <main id="konten" className="max-w-2xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold text-[#26321f]">Data uji selesai dimuat</h1>
      <p className="text-neutral-600 text-sm">
        Halaman ini sengaja dibuat lambat 2 detik untuk menguji aktivasi berkas <code>loading.tsx</code>.
      </p>
    </main>
  );
}
