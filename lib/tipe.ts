export type Kategori =
  | "lokal"
  | "unggulan"
  | "premium"
  | "energi"
  | "lingkungan"
  | "kampus";

export interface Item {
  id: number;
  judul: string;
  kategori: Kategori;
  deskripsi: string;
  tersedia: boolean;
  gambar: string | null;
  dibuatPada?: Date;
}

export interface Ulasan {
  id: number;
  nama: string;
  nilai: number;
  komentar: string;
  dibuatPada: Date;
  itemId: number;
}
