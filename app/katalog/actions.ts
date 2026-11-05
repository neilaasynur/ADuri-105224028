"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaItem } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

function bacaForm(formData: FormData) {
  return skemaItem.safeParse({
    ...Object.fromEntries(formData),
    tersedia: formData.get("tersedia") === "on",
  });
}

export async function tambahItem(
  _prev: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const hasil = bacaForm(formData);
  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }
  try {
    const { judul, kategori, deskripsi, tersedia } = hasil.data;
    await prisma.item.create({
      data: { judul, kategori, deskripsi, tersedia },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { galat: { judul: ["Judul item sudah terdaftar"] } };
    }
    throw e;
  }
  revalidatePath("/katalog");
  return { pesan: "Item tersimpan." };
}

export async function ubahItem(
  id: number,
  _prev: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const hasil = bacaForm(formData);
  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }
  try {
    const { judul, kategori, deskripsi, tersedia } = hasil.data;
    await prisma.item.update({
      where: { id },
      data: { judul, kategori, deskripsi, tersedia },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return { galat: { judul: ["Judul item sudah terdaftar"] } };
      }
      if (e.code === "P2025") {
        return { pesan: "Item tidak ditemukan atau sudah dihapus." };
      }
    }
    throw e;
  }
  revalidatePath("/katalog");
  revalidatePath(`/katalog/${id}`);
  return { pesan: "Perubahan disimpan." };
}

export async function hapusItem(id: number) {
  await prisma.$transaction([
    prisma.ulasan.deleteMany({ where: { itemId: id } }),
    prisma.item.delete({ where: { id } }),
  ]);
  revalidatePath("/katalog");
  redirect("/katalog");
}
