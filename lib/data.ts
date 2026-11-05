import "server-only";
import { prisma } from "@/lib/prisma";
import type { Item } from "@/lib/tipe";
import { DURIAN_PRODUCTS } from "@/data/products";
import { Product } from "@/types/durian";
import type { MasukanItem } from "@/schema/skema";

// ==========================================
// MODUL 6: PostgreSQL dan Prisma Client
// ==========================================
const kolomItem = {
  id: true,
  judul: true,
  kategori: true,
  deskripsi: true,
  tersedia: true,
  gambar: true,
} as const;

export async function ambilDaftarItem(): Promise<Item[]> {
  return prisma.item.findMany({
    select: kolomItem,
    orderBy: { dibuatPada: "desc" },
  });
}

export async function ambilItem(id: number) {
  return prisma.item.findUnique({
    where: { id },
    select: {
      ...kolomItem,
      ulasan: {
        select: { id: true, nama: true, nilai: true, komentar: true },
        orderBy: { dibuatPada: "desc" },
      },
    },
  });
}

// ==========================================
// MODUL 4 & 5: Backward Compatibility Data
// ==========================================
const g = globalThis as unknown as { daftarProduk?: Product[] };
export const daftarItem: Product[] = (g.daftarProduk ??= [...DURIAN_PRODUCTS]);

export function ambilSemuaProduk(): Product[] {
  return daftarItem;
}

export function cariProduk(slug: string): Product | undefined {
  return daftarItem.find((p) => p.slug === slug || p.id === slug);
}

export function cariItem(id: number | string): Product | undefined {
  return daftarItem.find((p) => p.id === String(id) || p.slug === String(id));
}

export function judulSudahAda(judul: string): boolean {
  const dicari = judul.trim().toLowerCase();
  const slugDicari = dicari.replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
  return daftarItem.some((i) => {
    const namaItem = i.name.toLowerCase();
    const slugItem = i.slug.toLowerCase();
    return (
      namaItem === dicari ||
      slugItem === dicari ||
      slugItem === slugDicari ||
      namaItem.includes(dicari) ||
      dicari.includes(namaItem)
    );
  });
}

export const namaSudahAda = judulSudahAda;

export function tambahItem(masukan: MasukanItem): Product {
  const maxId = daftarItem.reduce((max, item) => {
    const num = parseInt(item.id, 10);
    return !isNaN(num) && num > max ? num : max;
  }, 0);

  const newId = String(maxId + 1);
  const slug = masukan.judul
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  const hargaNum = masukan.harga ?? 45000;
  const hargaFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(hargaNum);

  const produkBaru: Product = {
    id: newId,
    slug: slug || `durian-panen-${newId}`,
    name: masukan.judul,
    tagline: `Varietas durian ${masukan.kategori} panen segar kebun keluarga`,
    price: hargaNum,
    priceFormatted: hargaFormatted,
    unit: "kg",
    sweetness: 5,
    creaminess: 4,
    aroma: "Harum Khas Durian Riau",
    weightRange: "1.5 - 3.0 kg / buah",
    description: masukan.deskripsi,
    details: [
      `Kategori varietas: ${masukan.kategori}`,
      masukan.tersedia ? "Stok panen siap kirim hari ini" : "Stok panen terbatas",
      "Garansi ganti baru jika buah mentah",
      "Dipetik langsung saat matang pohon",
    ],
    image: "/durian.png",
    origin: "Kampar, Riau",
    isBestSeller: masukan.kategori === "premium",
  };

  daftarItem.push(produkBaru);
  return produkBaru;
}

export const tambahProduk = tambahItem;
