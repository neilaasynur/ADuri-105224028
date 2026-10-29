import "server-only";
import { DURIAN_PRODUCTS } from "@/data/products";
import { Product } from "@/types/durian";
import type { MasukanItem } from "@/schema/skema";

// Penyimpanan data dinamis di memori server (globalThis bertahan saat Fast Refresh)
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

// 1. Validasi Semantik Bisnis: Memastikan nama varietas belum pernah terdaftar
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

// 2. Mutasi Data: Menambahkan varietas durian panen baru ke katalog aktif
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

  const hargaFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(masukan.harga);

  const produkBaru: Product = {
    id: newId,
    slug: slug || `durian-panen-${newId}`,
    name: masukan.judul,
    tagline: `Varietas durian ${masukan.kategori} panen segar kebun keluarga`,
    price: masukan.harga,
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
