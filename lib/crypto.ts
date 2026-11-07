/**
 * lib/crypto.ts
 * Modul Kriptografi Terpadu — ADuri (Kebun Durian Keluarga Asynur)
 *
 * Mengimplementasikan:
 *  - T1 (v0.1): Password Hashing (bcrypt), Kanonisasi JSON deterministik, HMAC-SHA256 pesanan
 *  - T2 (v0.2): Authenticated Encryption with Associated Data (AEAD - AES-256-GCM),
 *               Derivasi Kunci HKDF-SHA256 (RFC 5869), Validasi Masukan Allowlist & Fail-Closed
 *
 * Standar Acuan:
 *  - NIST SP 800-38D (Galois/Counter Mode - GCM)
 *  - RFC 5869 (HKDF: HMAC-based Extract-and-Expand Key Derivation Function)
 *  - OWASP Cryptographic Storage Cheat Sheet
 */

import bcrypt from 'bcryptjs';
import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  hkdfSync,
  randomBytes,
  timingSafeEqual,
} from 'crypto';

// ─────────────────────────────────────────────────────────────
// 1. KONSTANTA KRIPTOGRAFI (PARAMETER TERDOKUMENTASI)
// ─────────────────────────────────────────────────────────────

/** Panjang kunci standar AES-256: 32 byte (256-bit) */
export const PANJANG_KUNCI = 32;

/**
 * Panjang Nonce / IV rekomendasi NIST SP 800-38D untuk AES-GCM: 12 byte (96-bit).
 * Menggunakan 96-bit mencegah overhead penghitungan fungsi GHASH pada IV di awal.
 */
export const PANJANG_NONCE = 12;

/** Panjang authentication tag standar GCM: 16 byte (128-bit) */
export const PANJANG_TAG = 16;

/** Jumlah iterasi bcrypt (2^12 = 4.096 putaran) */
const SALT_ROUNDS = 12;

/** Nama environment variable untuk master key di luar repositori */
export const NAMA_ENV_KUNCI = 'ENCRYPTION_KEY';
export const NAMA_ENV_HMAC = 'HMAC_SECRET';

// ─────────────────────────────────────────────────────────────
// 2. KELAS KESALAHAN SPESIFIK (FAIL-CLOSED ERROR HANDLING)
// ─────────────────────────────────────────────────────────────

/**
 * Galat saat kunci tidak valid.
 * CATATAN KEAMANAN: Pesan galat TIDAK PERNAH memuat isi/material kunci!
 */
export class KunciTidakValid extends Error {
  constructor(pesan: string) {
    super(`[KunciTidakValid] ${pesan}`);
    this.name = 'KunciTidakValid';
  }
}

/**
 * Galat saat otentikasi data gagal (ciphertext/tag diubah, AAD salah, kunci salah).
 * Bersifat gagal tertutup (fail-closed) tanpa membocorkan plaintext atau detail internal.
 */
export class AutentikasiGagal extends Error {
  constructor(pesan = 'Otentikasi data gagal: data atau tag telah dimodifikasi, AAD tidak cocok, atau kunci salah') {
    super(`[AutentikasiGagal] ${pesan}`);
    this.name = 'AutentikasiGagal';
  }
}

/**
 * Galat saat masukan tidak memenuhi kriteria allowlist data produk.
 */
export class MasukanTidakValid extends Error {
  constructor(pesan: string) {
    super(`[MasukanTidakValid] ${pesan}`);
    this.name = 'MasukanTidakValid';
  }
}

// ─────────────────────────────────────────────────────────────
// 3. MANAJEMEN KUNCI & DERIVASI HKDF (RFC 5869)
// ─────────────────────────────────────────────────────────────

/**
 * Membangkitkan kunci master baru berukuran 256-bit menggunakan CSPRNG.
 * Keluaran berupa representasi hex 64 karakter untuk disimpan di .env.local.
 */
export function buatKunciBaru(): string {
  return randomBytes(PANJANG_KUNCI).toString('hex');
}

/**
 * Memuat dan memvalidasi kunci master dari environment variable atau parameter eksplisit.
 * Memastikan kunci tepat 32 byte (baik format hex 64 char atau string ASCII/UTF8 32 char).
 * Pesan kesalahan tidak pernah menampilkan isi kunci.
 */
export function muatKunciMaster(kunciRaw?: string): Buffer {
  const raw = kunciRaw ?? process.env[NAMA_ENV_KUNCI] ?? '';
  if (!raw) {
    throw new KunciTidakValid(`Kunci tidak ditemukan di environment variable ${NAMA_ENV_KUNCI}`);
  }

  let buf: Buffer;
  // Jika panjang 64 char dan hex valid, parse sebagai hex (32 byte)
  if (raw.length === 64 && /^[0-9a-fA-F]{64}$/.test(raw)) {
    buf = Buffer.from(raw, 'hex');
  } else if (raw.length === PANJANG_KUNCI) {
    buf = Buffer.from(raw, 'utf8');
  } else {
    throw new KunciTidakValid(
      `Panjang kunci tidak valid. Kunci harus berupa 32 karakter teks atau 64 karakter heksadesimal (256-bit).`
    );
  }

  if (buf.length !== PANJANG_KUNCI) {
    throw new KunciTidakValid('Panjang kunci setelah konversi bukan 32 byte');
  }

  return buf;
}

/**
 * Menurunkan sub-kunci spesifik tujuan menggunakan HKDF-SHA256 (RFC 5869).
 * Mencegah key reuse (misal kunci yang sama dipakai untuk AEAD dan HMAC).
 *
 * @param kunciInduk Kunci master (Buffer atau string)
 * @param tujuan Label tujuan, misal 'aead_produk' atau 'hmac_pesanan'
 * @returns Buffer 32 byte (256-bit) kunci turunan
 */
export function turunkanKunci(kunciInduk: Buffer | string, tujuan: string): Buffer {
  let masterBuf: Buffer;
  if (Buffer.isBuffer(kunciInduk)) {
    masterBuf = kunciInduk;
  } else if (typeof kunciInduk === 'string' && kunciInduk.length > 0) {
    if (kunciInduk.length === 64 && /^[0-9a-fA-F]{64}$/.test(kunciInduk)) {
      masterBuf = Buffer.from(kunciInduk, 'hex');
    } else if (kunciInduk.length >= 16) {
      masterBuf = Buffer.from(kunciInduk, 'utf8');
    } else {
      throw new KunciTidakValid('Panjang kunci induk terlalu pendek (minimal 16 karakter)');
    }
  } else {
    masterBuf = muatKunciMaster();
  }

  if (!tujuan || typeof tujuan !== 'string') {
    throw new KunciTidakValid('Tujuan derivasi kunci wajib diisi');
  }

  const info = Buffer.from(`aduri v0.2 ${tujuan}`, 'utf8');
  // HKDF-SHA256: algorithm='sha256', ikm=masterBuf, salt='', info=info, length=32
  const derived = hkdfSync('sha256', masterBuf, Buffer.alloc(0), info, PANJANG_KUNCI);
  return Buffer.from(derived);
}

// ─────────────────────────────────────────────────────────────
// 4. KANONISASI DATA DETERMINISTIK (T1 -> T2 INTEGRATION)
// ─────────────────────────────────────────────────────────────

/**
 * Mengubah objek menjadi representasi JSON kanonis deterministik:
 * 1. Properti diurutkan secara alfabetis (leksikografis).
 * 2. Pemisah tanpa spasi redundan (',' dan ':').
 * 3. Menghasilkan byte representasi yang identik di semua platform.
 */
export function kanonisasiJson(obj: Record<string, unknown>): string {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new MasukanTidakValid('Masukan kanonisasi harus berupa objek non-null');
  }

  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, unknown> = {};

  for (const key of sortedKeys) {
    const val = obj[key];
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      sortedObj[key] = JSON.parse(kanonisasiJson(val as Record<string, unknown>));
    } else {
      sortedObj[key] = val;
    }
  }

  return JSON.stringify(sortedObj);
}

// ─────────────────────────────────────────────────────────────
// 5. VALIDASI MASUKAN PRODUK DURIAN (ALLOWLIST & FAIL-CLOSED)
// ─────────────────────────────────────────────────────────────

export interface CatatanProduk {
  id_produk: string;    // Regex: DRN-[A-Z]{3,8}-\d{3} (misal: DRN-MKG-001)
  nama: string;         // String nama varietas (3-100 char)
  kategori: 'lokal' | 'unggulan' | 'premium';
  harga: number;        // Bilangan riil/integer finite >= 0
  stok_rahasia: number; // Integer finite >= 0 (kuota/stok rahasia gudang)
  waktu_panen: string;  // Format ISO YYYY-MM-DDTHH:MM
}

const FIELD_PRODUK_WAJIB = new Set([
  'id_produk',
  'nama',
  'kategori',
  'harga',
  'stok_rahasia',
  'waktu_panen',
]);

const POLA_ID_PRODUK = /^DRN-[A-Z0-9]{3,8}-\d{3}$/;
const POLA_WAKTU = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const KATEGORI_VALID = new Set(['lokal', 'unggulan', 'premium']);

/**
 * Memvalidasi data produk dengan prinsip allowlist ketat.
 * Menolak field tak dikenal, tipe data tidak sah, NaN/Infinity, atau format tidak sesuai.
 */
export function validasiCatatanProduk(input: unknown): CatatanProduk {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new MasukanTidakValid('Catatan produk harus berupa objek JSON');
  }

  const record = input as Record<string, unknown>;
  const keys = Object.keys(record);

  // Allowlist ketat: tidak boleh ada field asing/berlebih
  for (const k of keys) {
    if (!FIELD_PRODUK_WAJIB.has(k)) {
      throw new MasukanTidakValid(`Field tidak diizinkan pada catatan produk: ${k}`);
    }
  }

  for (const required of FIELD_PRODUK_WAJIB) {
    if (!(required in record)) {
      throw new MasukanTidakValid(`Field wajib tidak ditemukan: ${required}`);
    }
  }

  const { id_produk, nama, kategori, harga, stok_rahasia, waktu_panen } = record;

  if (typeof id_produk !== 'string' || !POLA_ID_PRODUK.test(id_produk)) {
    throw new MasukanTidakValid(
      `id_produk tidak valid (${String(id_produk)}). Format harus seperti 'DRN-MKG-001'`
    );
  }

  if (typeof nama !== 'string' || nama.trim().length < 3 || nama.length > 100) {
    throw new MasukanTidakValid('Nama produk harus berupa string 3–100 karakter');
  }

  if (typeof kategori !== 'string' || !KATEGORI_VALID.has(kategori)) {
    throw new MasukanTidakValid(`Kategori harus salah satu dari: lokal, unggulan, premium`);
  }

  if (typeof harga !== 'number' || !Number.isFinite(harga) || harga < 0) {
    throw new MasukanTidakValid('Harga harus berupa angka riil finite >= 0');
  }

  if (
    typeof stok_rahasia !== 'number' ||
    !Number.isInteger(stok_rahasia) ||
    stok_rahasia < 0
  ) {
    throw new MasukanTidakValid('stok_rahasia harus berupa bilangan bulat integer >= 0');
  }

  if (typeof waktu_panen !== 'string' || !POLA_WAKTU.test(waktu_panen)) {
    throw new MasukanTidakValid('waktu_panen harus berformat YYYY-MM-DDTHH:MM');
  }

  const parsedDate = new Date(waktu_panen);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new MasukanTidakValid('waktu_panen bukan tanggal kalender yang valid');
  }

  return {
    id_produk,
    nama: nama.trim(),
    kategori: kategori as 'lokal' | 'unggulan' | 'premium',
    harga: Number(harga),
    stok_rahasia: Number(stok_rahasia),
    waktu_panen,
  };
}

// ─────────────────────────────────────────────────────────────
// 6. ENKRIPSI TERAUTENTIKASI (AEAD: AES-256-GCM DENGAN AAD)
// ─────────────────────────────────────────────────────────────

/**
 * Mengenkripsi catatan produk menggunakan AES-256-GCM dengan AAD kontekstual.
 *
 * Alur Sambungan T1 -> T2:
 *  1. Input divalidasi via allowlist (`validasiCatatanProduk`).
 *  2. Input diubah ke bentuk JSON kanonis (T1: `kanonisasiJson`).
 *  3. Kunci master diturunkan via HKDF untuk tujuan 'aead_produk'.
 *  4. Nonce 12-byte dibangkitkan segar dari CSPRNG (`randomBytes(12)`).
 *  5. AAD diikat ke `id_produk` produk durian (context-binding).
 *  6. Ciphertext + 16-byte Auth Tag dihasilkan.
 *
 * @param catatan Objek data produk
 * @param kunciInduk Kunci master opsional (default dari .env.local)
 * @returns Paket hex string format: "iv:authTag:ciphertext"
 */
export function enkripsiProdukAead(
  catatan: CatatanProduk,
  kunciInduk?: Buffer | string
): string {
  // Validasi masukan (fail-closed)
  const bersih = validasiCatatanProduk(catatan);

  // Sambungan T1: Bentuk kanonis deterministik
  const plaintextKanonis = kanonisasiJson(bersih as unknown as Record<string, unknown>);

  // Derivasi kunci khusus AEAD (Key Separation)
  const keyAead = turunkanKunci(kunciInduk ?? muatKunciMaster(), 'aead_produk');

  // CSPRNG Nonce 96-bit (12 bytes)
  const iv = randomBytes(PANJANG_NONCE);

  // AAD mengikat rekaman dengan ID produk
  const aad = Buffer.from(bersih.id_produk, 'utf8');

  const cipher = createCipheriv('aes-256-gcm', keyAead, iv);
  cipher.setAAD(aad);

  const encrypted = Buffer.concat([
    cipher.update(plaintextKanonis, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag(); // 128-bit authentication tag

  // Format terstandar: iv:authTag:ciphertext (semua hex)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Mendekripsi dan memverifikasi paket AEAD catatan produk.
 * Menerapkan prinsip fail-closed: jika ciphertext, tag, AAD, atau kunci dimodifikasi,
 * fungsi langsung melempar AutentikasiGagal tanpa membocorkan data.
 *
 * @param paketHex Paket string format "iv:authTag:ciphertext"
 * @param idProdukAad ID produk yang diharapkan sebagai AAD
 * @param kunciInduk Kunci master opsional
 * @returns CatatanProduk yang telah terverifikasi utuh
 */
export function dekripsiProdukAead(
  paketHex: string,
  idProdukAad: string,
  kunciInduk?: Buffer | string
): CatatanProduk {
  if (!paketHex || typeof paketHex !== 'string') {
    throw new MasukanTidakValid('Paket terenkripsi harus berupa string');
  }

  if (!idProdukAad || typeof idProdukAad !== 'string') {
    throw new MasukanTidakValid('idProdukAad (AAD) wajib diisi untuk verifikasi integritas');
  }

  const parts = paketHex.split(':');
  if (parts.length !== 3) {
    throw new MasukanTidakValid('Format paket terenkripsi tidak valid (harus iv:authTag:ciphertext)');
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;

  if (ivHex.length !== PANJANG_NONCE * 2) {
    throw new MasukanTidakValid(`Panjang IV tidak valid (harus ${PANJANG_NONCE * 2} hex char)`);
  }

  if (authTagHex.length !== PANJANG_TAG * 2) {
    throw new MasukanTidakValid(`Panjang Auth Tag tidak valid (harus ${PANJANG_TAG * 2} hex char)`);
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const ciphertext = Buffer.from(ciphertextHex, 'hex');

  // Derivasi kunci khusus AEAD
  const keyAead = turunkanKunci(kunciInduk ?? muatKunciMaster(), 'aead_produk');

  const aad = Buffer.from(idProdukAad, 'utf8');

  try {
    const decipher = createDecipheriv('aes-256-gcm', keyAead, iv);
    decipher.setAAD(aad);
    decipher.setAuthTag(authTag);

    const decryptedBuf = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    const plaintext = decryptedBuf.toString('utf8');
    const parsed = JSON.parse(plaintext);
    return validasiCatatanProduk(parsed);
  } catch (err) {
    // Fail-closed: bungkus setiap kegagalan dekripsi/otentikasi ke AutentikasiGagal
    if (err instanceof MasukanTidakValid) throw err;
    throw new AutentikasiGagal();
  }
}

// ─────────────────────────────────────────────────────────────
// 7. KOMPONEN T1 YANG DIPERTAHANKAN (KOMPATIBILITAS MUNDUR)
// ─────────────────────────────────────────────────────────────

/**
 * Hash password menggunakan bcrypt (komponen T1).
 */
export async function hashPassword(plaintext: string): Promise<string> {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new MasukanTidakValid('Password harus berupa string yang tidak kosong');
  }
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

/**
 * Verifikasi hash password bcrypt (komponen T1).
 */
export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  if (!plaintext || !hash) {
    throw new MasukanTidakValid('Password dan hash wajib diisi');
  }
  return bcrypt.compare(plaintext, hash);
}

/**
 * Enkripsi data umum (T1 compat).
 */
export function encryptData(plaintext: string, kunciRaw?: string): string {
  if (!plaintext) {
    throw new MasukanTidakValid('Data yang dienkripsi tidak boleh kosong');
  }
  const key = muatKunciMaster(kunciRaw);
  const iv = randomBytes(PANJANG_NONCE);
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Dekripsi data umum (T1 compat).
 */
export function decryptData(encryptedData: string, kunciRaw?: string): string {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new MasukanTidakValid('Format data terenkripsi tidak valid');
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;
  const key = muatKunciMaster(kunciRaw);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const ciphertext = Buffer.from(ciphertextHex, 'hex');

  try {
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    return decipher.update(ciphertext).toString('utf8') + decipher.final('utf8');
  } catch {
    throw new AutentikasiGagal();
  }
}

/**
 * Menghasilkan tanda tangan HMAC-SHA256 untuk payload pesanan (komponen T1).
 * Menggunakan kunci turunan 'hmac_pesanan' via HKDF untuk memisahkan domain kunci.
 */
export function generateOrderHMAC(payload: object, secretRaw?: string): string {
  const masterKey = secretRaw ?? process.env[NAMA_ENV_HMAC] ?? process.env[NAMA_ENV_KUNCI];
  if (!masterKey) {
    throw new KunciTidakValid(`Secret HMAC wajib diset di environment variable`);
  }

  // Turunkan kunci khusus HMAC menggunakan HKDF
  const hmacKey = turunkanKunci(masterKey, 'hmac_pesanan');

  // Sambungan T1: Gunakan kanonisasi JSON deterministik sebelum di-HMAC
  const kanonis = typeof payload === 'object' && payload !== null
    ? kanonisasiJson(payload as Record<string, unknown>)
    : JSON.stringify(payload);

  return createHmac('sha256', hmacKey).update(kanonis).digest('hex');
}

/**
 * Verifikasi tanda tangan HMAC-SHA256 dengan timingSafeEqual (mencegah timing attack).
 */
export function verifyOrderHMAC(
  payload: object,
  signature: string,
  secretRaw?: string
): boolean {
  try {
    const expected = generateOrderHMAC(payload, secretRaw);
    const expectedBuf = Buffer.from(expected, 'hex');
    const signatureBuf = Buffer.from(signature, 'hex');

    if (expectedBuf.length !== signatureBuf.length) return false;
    return timingSafeEqual(expectedBuf, signatureBuf);
  } catch {
    return false;
  }
}
