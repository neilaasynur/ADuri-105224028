import type { Kategori } from "../lib/tipe";

type DataAwal = {
  judul: string;
  kategori: Kategori;
  deskripsi: string;
  tersedia: boolean;
};

export const dataAwal: DataAwal[] = [
  {
    judul: "Durian Tembaga Kampar",
    kategori: "unggulan",
    deskripsi: "Daging buah berwarna kuning tembaga tebal dengan rasa manis legit berpadu sedikit pahit khas Kampar.",
    tersedia: true,
  },
  {
    judul: "Durian Musang King Riau",
    kategori: "premium",
    deskripsi: "Varietas unggul kualitas ekspor dengan daging lembut creamy keemasan dan biji kempis.",
    tersedia: true,
  },
  {
    judul: "Durian Ochee Duri Hitam",
    kategori: "premium",
    deskripsi: "Daging buah berwarna jingga kemerahan dengan aroma intens dan tekstur lumer di mulut.",
    tersedia: true,
  },
  {
    judul: "Durian Kampung Kampar",
    kategori: "lokal",
    deskripsi: "Durian pohon tua asli Kampar dengan variasi rasa manis khas lokal Riau yang kaya serat alami.",
    tersedia: true,
  },
  {
    judul: "Durian Montong Riau",
    kategori: "unggulan",
    deskripsi: "Porsi daging buah sangat tebal berukuran jumbo, rasa manis legit cocok dinikmati bersama keluarga.",
    tersedia: true,
  },
  {
    judul: "Daging Durian Beku Murni",
    kategori: "lokal",
    deskripsi: "Daging durian murni tanpa biji dan tanpa pengawet yang dibekukan untuk kebutuhan kuliner dan oleh-oleh.",
    tersedia: true,
  },
];
