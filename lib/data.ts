import "server-only";
import { DURIAN_PRODUCTS } from "@/data/products";
import { Product } from "@/types/durian";

export function ambilSemuaProduk(): Product[] {
  return DURIAN_PRODUCTS;
}

export function cariProduk(slug: string): Product | undefined {
  return DURIAN_PRODUCTS.find((p) => p.slug === slug);
}
