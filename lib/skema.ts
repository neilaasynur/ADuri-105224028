import { z } from "zod";

/**
 * Regex aturan:
 * - NAMA: Hanya huruf abjad (A-Z, a-z), spasi, serta tanda petik tunggal/titik (untuk gelar/nama keluarga).
 * - TELEPON: Wajib diawali 08 dan seluruhnya angka numerik (10 - 14 digit).
 */
const NAMA_HURUF_REGEX = /^[a-zA-Z\s'.]+$/;
const TELEPON_ANGKA_REGEX = /^08[0-9]{8,12}$/;

// 1. Skema Validasi Formulir Pemesanan & Pembayaran
export const skemaPembayaran = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(80, "Nama lengkap maksimal 80 karakter")
    .regex(NAMA_HURUF_REGEX, "Nama lengkap harus diisi dengan huruf abjad (tidak boleh mengandung angka atau simbol)"),

  phone: z
    .string()
    .trim()
    .regex(TELEPON_ANGKA_REGEX, "Nomor telepon harus berupa angka, diawali '08', dan terdiri dari 10-14 digit"),

  district: z
    .string()
    .min(1, "Wilayah kabupaten/kota pengiriman wajib dipilih"),

  address: z
    .string()
    .trim()
    .min(10, "Alamat lengkap pengiriman minimal 10 karakter (sertakan nama jalan, nomor, atau patokan)")
    .max(300, "Alamat pengiriman maksimal 300 karakter"),

  notes: z
    .string()
    .max(200, "Catatan pesanan maksimal 200 karakter")
    .optional(),

  quantity: z
    .number()
    .int("Jumlah harus bilangan bulat")
    .min(1, "Jumlah pesanan minimal 1 buah/kg")
    .max(20, "Jumlah pesanan maksimal 20 buah/kg per transaksi"),

  paymentMethod: z.enum(["qris", "transfer"], {
    error: "Pilih salah satu metode pembayaran yang sah (QRIS atau Transfer Bank)",
  }),

  productSlug: z
    .string()
    .min(1, "Varietas durian wajib dipilih"),
});

export type MasukanPembayaran = z.infer<typeof skemaPembayaran>;

// 2. Skema Validasi Formulir Reservasi Kunjungan Kebun (Ambil Sendiri)
export const skemaKunjungan = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(80, "Nama lengkap maksimal 80 karakter")
    .regex(NAMA_HURUF_REGEX, "Nama lengkap harus diisi dengan huruf abjad (tidak boleh mengandung angka atau simbol)"),

  phone: z
    .string()
    .trim()
    .regex(TELEPON_ANGKA_REGEX, "Nomor telepon harus berupa angka, diawali '08', dan terdiri dari 10-14 digit"),

  visitDate: z
    .string()
    .min(1, "Tanggal rencana kunjungan kebun wajib dipilih"),

  visitTime: z
    .string()
    .min(1, "Perkiraan jam kedatangan wajib dipilih"),

  visitorCount: z
    .number()
    .int("Jumlah pengunjung harus bilangan bulat")
    .min(1, "Jumlah rombongan minimal 1 orang")
    .max(20, "Jumlah rombongan maksimal 20 orang"),

  notes: z
    .string()
    .max(200, "Catatan kunjungan maksimal 200 karakter")
    .optional(),

  paymentMethod: z.enum(["qris", "transfer"], {
    error: "Pilih salah satu metode pembayaran deposit yang sah",
  }),
});

export type MasukanKunjungan = z.infer<typeof skemaKunjungan>;

// 3. Skema Modul 5 Standar (Untuk Penambahan Item & Login di Lab)
export const skemaItem = z.object({
  judul: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter")
    .max(80, "Judul maksimal 80 karakter"),
  kategori: z.enum(["lokal", "unggulan", "premium"], {
    error: "Pilih salah satu kategori",
  }),
  deskripsi: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(300, "Deskripsi maksimal 300 karakter"),
  tersedia: z.stringbool().default(false),
});

export type MasukanItem = z.infer<typeof skemaItem>;

export const skemaMasuk = z.object({
  email: z.email("Format email tidak valid"),
  kataSandi: z.string().min(8, "Kata sandi minimal 8 karakter"),
});
