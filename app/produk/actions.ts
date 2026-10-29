"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { skemaItem } from "@/schema/skema";
import { judulSudahAda, tambahItem } from "@/lib/data";
import { bacaSesi } from "@/schema/sesi";
import type { StatusForm } from "@/schema/status-form";
import type { Product } from "@/types/durian";

export async function simpanItem(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  // 1. Pemeriksaan Sesi: Hanya pengelola yang terotentikasi yang boleh menambah produk
  const sesi = await bacaSesi();
  if (!sesi) {
    return { pesan: "Silakan masuk terlebih dahulu sebagai pengelola." };
  }

  // Siapkan data mentah dan nilai untuk dikembalikan jika ada galat
  const mentah = Object.fromEntries(formData);
  const nilai = {
    judul: String(mentah.judul ?? ""),
    kategori: String(mentah.kategori ?? ""),
    harga: String(mentah.harga ?? ""),
    deskripsi: String(mentah.deskripsi ?? ""),
  };

  // 2. Validasi Bentuk (Sintaksis Zod 4)
  const hasil = skemaItem.safeParse(mentah);
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir varietas durian.",
      nilai,
    };
  }

  // 3. Validasi Aturan Semantik Bisnis (Nama varietas belum boleh terdaftar)
  if (judulSudahAda(hasil.data.judul)) {
    return {
      galat: {
        judul: ["Varietas durian dengan nama ini sudah terdaftar di katalog kebun."],
      },
      nilai,
    };
  }

  // 4. Mutasi Data ke Katalog Aktif
  let produkBaru: Product;
  try {
    produkBaru = tambahItem(hasil.data);
  } catch (e) {
    console.error("simpanItem gagal:", e);
    return { pesan: "Varietas durian gagal disimpan. Silakan coba lagi.", nilai };
  }

  // 5. Revalidasi cache katalog & Pengalihan Halaman (di luar blok try)
  revalidatePath("/produk");
  redirect(`/produk/${produkBaru.slug}`);
}

export const simpanProduk = simpanItem;
