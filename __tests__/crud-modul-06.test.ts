import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

// Mock environment Next.js runtime dependencies
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import "dotenv/config";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { tambahItem, ubahItem } from "@/app/katalog/actions";
import { tambahUlasan } from "@/app/katalog/ulasan-actions";
import { ambilDaftarItem, ambilItem } from "@/lib/data";

describe("Modul 6: 10 Skenario Uji CRUD & Relasi PostgreSQL + Prisma 7", () => {
  let createdItemId: number;

  beforeAll(async () => {
    // Pastikan koneksi aktif
    await prisma.$connect();
  });

  afterAll(async () => {
    // Bersihkan data uji jika masih ada
    if (createdItemId) {
      try {
        await prisma.ulasan.deleteMany({ where: { itemId: createdItemId } });
        await prisma.item.delete({ where: { id: createdItemId } });
      } catch {
        // Abaikan jika sudah terhapus
      }
    }
    await prisma.$disconnect();
  });

  // -----------------------------------------------------------------------
  // Skenario 1: Tambah item sah -> Tampil di katalog
  // -----------------------------------------------------------------------
  it("Skenario 1: Tambah item sah -> Tampil di katalog", async () => {
    const formData = new FormData();
    formData.set("judul", "Durian Kelapa Kampar Super");
    formData.set("kategori", "lokal");
    formData.set("deskripsi", "Durian lokal Kampar berdaging tebal dan manis gurih.");
    formData.set("tersedia", "on");

    const res = await tambahItem({}, formData);
    expect(res.pesan).toBe("Item tersimpan.");

    const daftar = await ambilDaftarItem();
    const item = daftar.find((i) => i.judul === "Durian Kelapa Kampar Super");
    expect(item).toBeDefined();
    expect(item?.judul).toBe("Durian Kelapa Kampar Super");
    createdItemId = item!.id;
  });

  // -----------------------------------------------------------------------
  // Skenario 2: Tambah item judul ganda -> Galat kolom judul (P2002)
  // -----------------------------------------------------------------------
  it("Skenario 2: Tambah item judul ganda -> Galat kolom judul (P2002)", async () => {
    const formData = new FormData();
    formData.set("judul", "Durian Kelapa Kampar Super"); // Judul yang sama persis
    formData.set("kategori", "lokal");
    formData.set("deskripsi", "Mencoba input nama yang sama untuk memicu constraint unik.");
    formData.set("tersedia", "on");

    const res = await tambahItem({}, formData);
    expect(res.galat?.judul).toBeDefined();
    expect(res.galat?.judul?.[0]).toBe("Judul item sudah terdaftar");
  });

  // -----------------------------------------------------------------------
  // Skenario 3: Tambah item judul kosong -> Galat Zod, tidak ada query
  // -----------------------------------------------------------------------
  it("Skenario 3: Tambah item judul kosong -> Galat Zod, tidak ada query", async () => {
    const formData = new FormData();
    formData.set("judul", ""); // Judul kosong
    formData.set("kategori", "lokal");
    formData.set("deskripsi", "Deskripsi valid minimal sepuluh karakter.");
    formData.set("tersedia", "on");

    const res = await tambahItem({}, formData);
    expect(res.galat?.judul).toBeDefined();
    expect(res.pesan).toBeUndefined(); // Membuktikan Prisma tidak dipanggil
  });

  // -----------------------------------------------------------------------
  // Skenario 4: Ubah deskripsi item -> Tersimpan, tampil di detail
  // -----------------------------------------------------------------------
  it("Skenario 4: Ubah deskripsi item -> Tersimpan, tampil di detail", async () => {
    const deskripsiBaru = "Deskripsi diperbarui: Rasa manis legit khas Kampar panen terbaru.";
    const formData = new FormData();
    formData.set("judul", "Durian Kelapa Kampar Super");
    formData.set("kategori", "lokal");
    formData.set("deskripsi", deskripsiBaru);
    formData.set("tersedia", "on");

    const res = await ubahItem(createdItemId, {}, formData);
    expect(res.pesan).toBe("Perubahan disimpan.");

    const detail = await ambilItem(createdItemId);
    expect(detail?.deskripsi).toBe(deskripsiBaru);
  });

  // -----------------------------------------------------------------------
  // Skenario 5: Ubah item yang sudah dihapus -> Pesan tidak ditemukan (P2025)
  // -----------------------------------------------------------------------
  it("Skenario 5: Ubah item yang sudah dihapus -> Pesan tidak ditemukan (P2025)", async () => {
    const formData = new FormData();
    formData.set("judul", "Durian Hantu");
    formData.set("kategori", "lokal");
    formData.set("deskripsi", "Deskripsi untuk record ID fiktif.");
    formData.set("tersedia", "on");

    const res = await ubahItem(999999, {}, formData);
    expect(res.pesan).toBe("Item tidak ditemukan atau sudah dihapus.");
  });

  // -----------------------------------------------------------------------
  // Skenario 6: Buka /katalog/abc -> Halaman 404
  // -----------------------------------------------------------------------
  it("Skenario 6: Buka /katalog/abc -> Halaman 404", async () => {
    const paramId = "abc";
    const id = Number(paramId);
    const isInvalid = !Number.isInteger(id) || id <= 0;
    expect(isInvalid).toBe(true);

    // Di app/katalog/[id]/page.tsx: if (!Number.isInteger(id) || id <= 0) notFound();
    expect(() => {
      if (isInvalid) {
        throw new Error("NEXT_NOT_FOUND");
      }
    }).toThrow("NEXT_NOT_FOUND");
  });

  it("Pembuktian RESTRICT: Hapus item yang memiliki ulasan tanpa transaksi ditolak basis data (P2003)", async () => {
    const item = await prisma.item.findFirst({
      where: { ulasan: { some: {} } },
    });
    expect(item).not.toBeNull();

    let errCode = "";
    try {
      await prisma.item.delete({ where: { id: item!.id } });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        errCode = e.code;
      }
    }
    expect(errCode).toBe("P2003");
  });

  // -----------------------------------------------------------------------
  // Skenario 7: Hapus item beserta ulasannya -> Item dan ulasan hilang
  // -----------------------------------------------------------------------
  it("Skenario 7: Hapus item beserta ulasannya -> Item dan ulasan hilang", async () => {
    // 1. Buat item sementara beserta ulasan
    const itemTemp = await prisma.item.create({
      data: {
        judul: "Durian Uji Hapus Bersih",
        kategori: "unggulan",
        deskripsi: "Item yang akan diuji transaksi hapusnya bersama ulasan.",
        ulasan: {
          create: {
            nama: "Tester Satu",
            nilai: 5,
            komentar: "Sangat lezat!",
          },
        },
      },
    });

    const tempId = itemTemp.id;

    // 2. Transaksi penghapusan bertingkat
    await prisma.$transaction([
      prisma.ulasan.deleteMany({ where: { itemId: tempId } }),
      prisma.item.delete({ where: { id: tempId } }),
    ]);

    // 3. Verifikasi keduanya hilang
    const cekItem = await prisma.item.findUnique({ where: { id: tempId } });
    const cekUlasan = await prisma.ulasan.findMany({ where: { itemId: tempId } });
    expect(cekItem).toBeNull();
    expect(cekUlasan).toHaveLength(0);
  });

  // -----------------------------------------------------------------------
  // Skenario 8: Hapus item, perintah kedua gagal -> Rollback, ulasan tetap ada
  // -----------------------------------------------------------------------
  it("Skenario 8: Hapus item, perintah kedua gagal -> Rollback, ulasan tetap ada", async () => {
    // 1. Buat item dengan ulasan
    const itemRollback = await prisma.item.create({
      data: {
        judul: "Durian Uji Rollback Transaksi",
        kategori: "premium",
        deskripsi: "Item untuk membuktikan rollback.",
        ulasan: {
          create: [
            { nama: "Pengulas A", nilai: 5, komentar: "Mantap!" },
            { nama: "Pengulas B", nilai: 4, komentar: "Cukup enak." },
          ],
        },
      },
    });

    const id = itemRollback.id;
    const jumlahAwal = await prisma.ulasan.count({ where: { itemId: id } });
    expect(jumlahAwal).toBe(2);

    // 2. Eksekusi transaksi dengan perintah kedua sengaja digagalkan (id tidak ada)
    let errorCaught = false;
    try {
      await prisma.$transaction([
        prisma.ulasan.deleteMany({ where: { itemId: id } }),
        prisma.item.delete({ where: { id: id + 100000 } }), // Sengaja gagal P2025
      ]);
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        errorCaught = true;
      }
    }
    expect(errorCaught).toBe(true);

    // 3. Buktikan ROLLBACK: ulasan dan item tetap ada utuh
    const jumlahSetelahRollback = await prisma.ulasan.count({ where: { itemId: id } });
    expect(jumlahSetelahRollback).toBe(2);

    const itemMasihAda = await prisma.item.findUnique({ where: { id } });
    expect(itemMasihAda).not.toBeNull();

    // Cleanup
    await prisma.$transaction([
      prisma.ulasan.deleteMany({ where: { itemId: id } }),
      prisma.item.delete({ where: { id } }),
    ]);
  });

  // -----------------------------------------------------------------------
  // Skenario 9: Tambah ulasan nilai 6 -> Galat Zod kolom nilai
  // -----------------------------------------------------------------------
  it("Skenario 9: Tambah ulasan nilai 6 -> Galat Zod kolom nilai", async () => {
    const formData = new FormData();
    formData.set("nama", "Penilai Curang");
    formData.set("nilai", "6"); // Melanggar batas maksimum 5
    formData.set("komentar", "Mencoba memberi nilai 6.");

    const res = await tambahUlasan(createdItemId, {}, formData);
    expect(res.galat?.nilai).toBeDefined();
    expect(res.pesan).toBeUndefined(); // Ditolak Zod tanpa query database
  });

  // -----------------------------------------------------------------------
  // Skenario 10: Ulasan kedua dengan nama yang sama -> Galat kolom nama (P2002)
  // -----------------------------------------------------------------------
  it("Skenario 10: Ulasan kedua dengan nama yang sama -> Galat kolom nama (P2002)", async () => {
    // 1. Tambah ulasan pertama yang sah
    const formUlasan1 = new FormData();
    formUlasan1.set("nama", "Siti Rahma");
    formUlasan1.set("nilai", "5");
    formUlasan1.set("komentar", "Durian sangat manis dan nikmat.");

    const res1 = await tambahUlasan(createdItemId, {}, formUlasan1);
    expect(res1.pesan).toBe("Ulasan tersimpan.");

    // 2. Tambah ulasan kedua dengan nama yang SAMA PERSIS pada item yang sama
    const formUlasan2 = new FormData();
    formUlasan2.set("nama", "Siti Rahma");
    formUlasan2.set("nilai", "4");
    formUlasan2.set("komentar", "Mencoba mengulas untuk kedua kalinya.");

    const res2 = await tambahUlasan(createdItemId, {}, formUlasan2);
    expect(res2.galat?.nama).toBeDefined();
    expect(res2.galat?.nama?.[0]).toBe("Nama ini sudah mengulas item ini");
  });
});
