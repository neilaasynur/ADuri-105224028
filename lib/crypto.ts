/**
 * lib/crypto.ts
 * Komponen kriptografi untuk ADuri — Website Penjualan Durian Keluarga Asynur
 *
 * Berisi 3 komponen utama:
 *  1. Hash & verifikasi password (bcrypt)
 *  2. Enkripsi & dekripsi data pribadi (AES-256-GCM)
 *  3. Buat & verifikasi tanda tangan pesanan (HMAC-SHA256)
 *
 * CATATAN: File ini hanya boleh dijalankan di sisi server (Server Component,
 * Route Handler, Server Action). Jangan diimpor dari Client Component.
 */

import bcrypt from 'bcryptjs';
import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'crypto';

// ─────────────────────────────────────────────────────────────
// Konstanta
// ─────────────────────────────────────────────────────────────

/** Jumlah iterasi bcrypt: 2^12 = 4.096 putaran */
const SALT_ROUNDS = 12;

/**
 * Kunci enkripsi AES-256 — harus tepat 32 karakter (256-bit).
 * Diambil dari environment variable, JANGAN di-hardcode di sini.
 */
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ?? '';

/**
 * Secret untuk HMAC pesanan.
 * Diambil dari environment variable, JANGAN di-hardcode di sini.
 */
const HMAC_SECRET = process.env.HMAC_SECRET ?? '';

// ─────────────────────────────────────────────────────────────
// 1. HASH PASSWORD (bcrypt)
// ─────────────────────────────────────────────────────────────

/**
 * Menghasilkan hash bcrypt dari password plaintext.
 *
 * Masukan : string password plaintext
 * Proses  : bcrypt membangkitkan salt acak 128-bit, lalu menjalankan
 *           algoritma Blowfish sebanyak 2^SALT_ROUNDS iterasi
 * Keluaran: string hash 60 karakter (format $2b$12$...)
 *
 * @throws Error jika password kosong atau bukan string
 */
export async function hashPassword(plaintext: string): Promise<string> {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('Password harus berupa string yang tidak kosong');
  }
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

/**
 * Memverifikasi apakah password plaintext cocok dengan hash yang tersimpan.
 *
 * Masukan : password plaintext + hash dari database
 * Keluaran: true jika cocok, false jika tidak
 *
 * @throws Error jika salah satu argumen kosong
 */
export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  if (!plaintext || !hash) {
    throw new Error('Password dan hash wajib diisi');
  }
  return bcrypt.compare(plaintext, hash);
}

// ─────────────────────────────────────────────────────────────
// 2. ENKRIPSI DATA PRIBADI (AES-256-GCM)
// ─────────────────────────────────────────────────────────────

/**
 * Mengenkripsi data plaintext menggunakan AES-256-GCM.
 *
 * Masukan : string plaintext (nomor rekening / nomor HP / alamat)
 * Proses  : randomBytes(12) → IV acak 96-bit
 *           AES-256-GCM(key, iv, plaintext) → ciphertext + auth tag 128-bit
 * Keluaran: string format "iv:authTag:ciphertext" (hex-encoded)
 * Sumber keacakan: crypto.randomBytes(12) — setiap enkripsi menghasilkan IV berbeda
 *
 * @throws Error jika ENCRYPTION_KEY tidak di-set atau plaintext kosong
 */
export function encryptData(plaintext: string): string {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('ENCRYPTION_KEY harus diset dan tepat 32 karakter di .env.local');
  }
  if (!plaintext) {
    throw new Error('Data yang dienkripsi tidak boleh kosong');
  }

  const iv = randomBytes(12); // 96-bit IV untuk GCM
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag(); // 128-bit authentication tag

  // Format: iv:authTag:ciphertext (semua hex)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Mendekripsi data yang dienkripsi oleh encryptData().
 *
 * Masukan : string format "iv:authTag:ciphertext" (hex-encoded)
 * Keluaran: string plaintext asli
 *
 * @throws Error jika format tidak valid atau autentikasi gagal (data dimanipulasi)
 */
export function decryptData(encryptedData: string): string {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('ENCRYPTION_KEY harus diset dan tepat 32 karakter di .env.local');
  }

  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Format data terenkripsi tidak valid');
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const ciphertext = Buffer.from(ciphertextHex, 'hex');

  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
  decipher.setAuthTag(authTag);

  return decipher.update(ciphertext).toString('utf8') + decipher.final('utf8');
}

// ─────────────────────────────────────────────────────────────
// 3. HMAC PESANAN (HMAC-SHA256)
// ─────────────────────────────────────────────────────────────

/**
 * Menghasilkan tanda tangan HMAC-SHA256 untuk payload pesanan.
 *
 * Masukan : objek payload pesanan (item, harga, total, userId)
 * Proses  : HMAC-SHA256(HMAC_SECRET, JSON.stringify(payload))
 * Keluaran: hex string 64 karakter (tanda tangan)
 * Sumber keacakan: tidak ada — fungsi deterministik
 *
 * @throws Error jika HMAC_SECRET tidak di-set
 */
export function generateOrderHMAC(payload: object): string {
  if (!HMAC_SECRET) {
    throw new Error('HMAC_SECRET harus diset di .env.local');
  }
  return createHmac('sha256', HMAC_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
}

/**
 * Memverifikasi apakah tanda tangan HMAC cocok dengan payload.
 * Menggunakan timingSafeEqual untuk mencegah timing attack.
 *
 * Masukan : payload pesanan + signature yang tersimpan
 * Keluaran: true jika valid (data tidak dimanipulasi), false jika tidak
 */
export function verifyOrderHMAC(payload: object, signature: string): boolean {
  if (!HMAC_SECRET) {
    throw new Error('HMAC_SECRET harus diset di .env.local');
  }
  const expected = generateOrderHMAC(payload);

  // timingSafeEqual mencegah timing attack (serangan berbasis waktu eksekusi)
  const expectedBuf = Buffer.from(expected, 'hex');
  const signatureBuf = Buffer.from(signature, 'hex');

  if (expectedBuf.length !== signatureBuf.length) return false;
  return timingSafeEqual(expectedBuf, signatureBuf);
}
