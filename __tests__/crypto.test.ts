/**
 * __tests__/crypto.test.ts
 * Uji Otomatis Komponen Kriptografi ADuri (Tugas 2 — Milestone v0.2)
 *
 * Menguji:
 *  - Kelompok 1: Hash Password (bcrypt) — Komponen T1
 *  - Kelompok 2: Enkripsi Dasar & Integritas Pesanan (HMAC-SHA256) — Komponen T1
 *  - Kelompok 3: AEAD Data Produk (AES-256-GCM + AAD) — Komponen T2 (Inti Tugas 2)
 *  - Kelompok 4: Manajemen Kunci, HKDF & Validasi Fail-Closed — Komponen T2
 *  - Kelompok 5: Uji Sambungan Antar-Komponen (T1 -> T2 Integration)
 */

import { describe, it, expect } from 'vitest';
import {
  // Komponen T1
  hashPassword,
  verifyPassword,
  encryptData,
  decryptData,
  generateOrderHMAC,
  verifyOrderHMAC,
  kanonisasiJson,
  // Komponen T2
  CatatanProduk,
  enkripsiProdukAead,
  dekripsiProdukAead,
  validasiCatatanProduk,
  muatKunciMaster,
  turunkanKunci,
  buatKunciBaru,
  AutentikasiGagal,
  MasukanTidakValid,
  KunciTidakValid,
  PANJANG_NONCE,
  PANJANG_TAG,
  PANJANG_KUNCI,
} from '../lib/crypto';

// ─────────────────────────────────────────────────────────────
// DATA UJI SINTETIS (PRODUK DURIAN ADURI)
// ─────────────────────────────────────────────────────────────

const CONTOH_PRODUK_SAH: CatatanProduk = {
  id_produk: 'DRN-MKG-001',
  nama: 'Durian Musang King Super Kampar',
  kategori: 'premium',
  harga: 180000,
  stok_rahasia: 45, // kuota panen rahasia kebun
  waktu_panen: '2026-11-07T07:00',
};

// ─────────────────────────────────────────────────────────────
// KELOMPOK 1: HASH PASSWORD (BCRYPT) — T1
// ─────────────────────────────────────────────────────────────
describe('Kelompok 1: Hash Password (bcrypt) — Komponen T1', () => {
  it('[POSITIF] menghasilkan hash bcrypt 60 karakter yang diawali $2b$', async () => {
    const hash = await hashPassword('DurianKamparManis123');
    expect(hash).toBeDefined();
    expect(hash.length).toBe(60);
    expect(hash.startsWith('$2b$')).toBe(true);
  });

  it('[POSITIF] verifikasi berhasil untuk password yang benar', async () => {
    const pwd = 'DurianKamparManis123';
    const hash = await hashPassword(pwd);
    const valid = await verifyPassword(pwd, hash);
    expect(valid).toBe(true);
  });

  it('[NEGATIF] verifikasi ditolak untuk password yang salah', async () => {
    const hash = await hashPassword('DurianKamparManis123');
    const valid = await verifyPassword('PasswordSalah123', hash);
    expect(valid).toBe(false);
  });

  it('[FAIL-CLOSED] melempar MasukanTidakValid jika password kosong', async () => {
    await expect(hashPassword('')).rejects.toThrow(MasukanTidakValid);
  });
});

// ─────────────────────────────────────────────────────────────
// KELOMPOK 2: INTEGRITAS PESANAN (HMAC-SHA256) — T1
// ─────────────────────────────────────────────────────────────
describe('Kelompok 2: Integritas Pesanan (HMAC-SHA256) — Komponen T1', () => {
  const pesananAsli = {
    item: 'Durian Musang King',
    qty: 2,
    total: 360000,
    userId: 'cust-kampar-001',
  };

  it('[POSITIF] menghasilkan tanda tangan HMAC yang sah dan terverifikasi', () => {
    const signature = generateOrderHMAC(pesananAsli);
    expect(signature).toBeDefined();
    expect(signature.length).toBe(64); // SHA-256 = 32 bytes = 64 hex char
    expect(verifyOrderHMAC(pesananAsli, signature)).toBe(true);
  });

  it('[NEGATIF] verifikasi gagal jika total pesanan dimanipulasi', () => {
    const signature = generateOrderHMAC(pesananAsli);
    const pesananManipulasi = { ...pesananAsli, total: 3600 }; // Manipulasi harga
    expect(verifyOrderHMAC(pesananManipulasi, signature)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// KELOMPOK 3: AEAD DATA PRODUK (AES-256-GCM + AAD) — T2 (INTI TUGAS 2)
// ─────────────────────────────────────────────────────────────
describe('Kelompok 3: AEAD Data Produk (AES-256-GCM + AAD) — Tugas 2', () => {
  // Skenario 1 — POSITIF
  it('[SKENARIO-1 POSITIF] enkripsi dan dekripsi produk dengan AAD berhasil utuh', () => {
    const paketHex = enkripsiProdukAead(CONTOH_PRODUK_SAH);
    expect(paketHex).toBeDefined();

    // Format harus iv:authTag:ciphertext (3 bagian hex dipisahkan tanda titik dua)
    const bagian = paketHex.split(':');
    expect(bagian.length).toBe(3);

    const [ivHex, tagHex, cipherHex] = bagian;
    expect(ivHex.length).toBe(PANJANG_NONCE * 2); // 12 bytes = 24 hex
    expect(tagHex.length).toBe(PANJANG_TAG * 2); // 16 bytes = 32 hex
    expect(cipherHex.length).toBeGreaterThan(0);

    // Dekripsi dengan AAD yang benar (id_produk)
    const hasilDekripsi = dekripsiProdukAead(paketHex, CONTOH_PRODUK_SAH.id_produk);
    expect(hasilDekripsi).toEqual(CONTOH_PRODUK_SAH);
  });

  // Skenario 2 — NEGATIF (Modifikasi Ciphertext)
  it('[SKENARIO-2 NEGATIF] paket dengan ciphertext dimodifikasi ditolak (AutentikasiGagal)', () => {
    const paketHex = enkripsiProdukAead(CONTOH_PRODUK_SAH);
    const [ivHex, tagHex, cipherHex] = paketHex.split(':');

    // Modifikasi 1 karakter hex pada ciphertext
    const cipherModif =
      (cipherHex[0] === 'a' ? 'b' : 'a') + cipherHex.substring(1);
    const paketCacat = `${ivHex}:${tagHex}:${cipherModif}`;

    // Wajib melempar AutentikasiGagal (fail-closed)
    expect(() =>
      dekripsiProdukAead(paketCacat, CONTOH_PRODUK_SAH.id_produk)
    ).toThrow(AutentikasiGagal);
  });

  // Skenario 3 — NEGATIF (Modifikasi Authentication Tag)
  it('[SKENARIO-3 NEGATIF] paket dengan auth tag dimodifikasi ditolak (AutentikasiGagal)', () => {
    const paketHex = enkripsiProdukAead(CONTOH_PRODUK_SAH);
    const [ivHex, tagHex, cipherHex] = paketHex.split(':');

    // Ubah auth tag
    const tagModif =
      (tagHex[0] === '0' ? '1' : '0') + tagHex.substring(1);
    const paketTagCacat = `${ivHex}:${tagModif}:${cipherHex}`;

    expect(() =>
      dekripsiProdukAead(paketTagCacat, CONTOH_PRODUK_SAH.id_produk)
    ).toThrow(AutentikasiGagal);
  });

  // Skenario 4 — NEGATIF (AAD Tidak Cocok / Manipulasi Relokasi Produk)
  it('[SKENARIO-4 NEGATIF] dekripsi dengan AAD yang berbeda ditolak (AutentikasiGagal)', () => {
    // Enkripsi produk Musang King (DRN-MKG-001)
    const paketHex = enkripsiProdukAead(CONTOH_PRODUK_SAH);

    // Penyerang mencoba menempelkan paket terenkripsi ini ke produk lain: Durian Lokal (DRN-LKL-002)
    const aadPalsu = 'DRN-LKL-002';

    // GMAC wajib mendeteksi ketidakcocokan AAD dan menolak
    expect(() => dekripsiProdukAead(paketHex, aadPalsu)).toThrow(AutentikasiGagal);
  });

  // Skenario 5 — NEGATIF (Kunci Dekripsi Salah)
  it('[SKENARIO-5 NEGATIF] dekripsi dengan kunci yang salah ditolak (AutentikasiGagal)', () => {
    const kunciBenar = buatKunciBaru();
    const kunciSalah = buatKunciBaru();

    const paketHex = enkripsiProdukAead(CONTOH_PRODUK_SAH, kunciBenar);

    expect(() =>
      dekripsiProdukAead(paketHex, CONTOH_PRODUK_SAH.id_produk, kunciSalah)
    ).toThrow(AutentikasiGagal);
  });

  // Skenario 6 — KARAKTERISTIK KRIPTOGRAFI (Nonce Unik CSPRNG)
  it('[SKENARIO-6 SIFAT KRIPTO] nonce selalu berbeda setiap enkripsi meski data identik', () => {
    const paket1 = enkripsiProdukAead(CONTOH_PRODUK_SAH);
    const paket2 = enkripsiProdukAead(CONTOH_PRODUK_SAH);

    const [iv1, , cipher1] = paket1.split(':');
    const [iv2, , cipher2] = paket2.split(':');

    // Nonce 96-bit CSPRNG wajib berbeda
    expect(iv1).not.toBe(iv2);
    // Karena IV berbeda, ciphertext juga wajib berbeda (mencegah leak pola data)
    expect(cipher1).not.toBe(cipher2);

    // Keduanya tetap dapat didekripsi ke data yang sama
    expect(dekripsiProdukAead(paket1, CONTOH_PRODUK_SAH.id_produk)).toEqual(
      CONTOH_PRODUK_SAH
    );
    expect(dekripsiProdukAead(paket2, CONTOH_PRODUK_SAH.id_produk)).toEqual(
      CONTOH_PRODUK_SAH
    );
  });
});

// ─────────────────────────────────────────────────────────────
// KELOMPOK 4: MANAJEMEN KUNCI & VALIDASI FAIL-CLOSED — T2
// ─────────────────────────────────────────────────────────────
describe('Kelompok 4: Manajemen Kunci (HKDF) & Validasi Masukan — Tugas 2', () => {
  it('[KEY SEPARATION] HKDF menghasilkan kunci berbeda untuk tujuan berbeda dari master key sama', () => {
    const master = buatKunciBaru();
    const keyAead = turunkanKunci(master, 'aead_produk');
    const keyHmac = turunkanKunci(master, 'hmac_pesanan');

    expect(keyAead.length).toBe(PANJANG_KUNCI);
    expect(keyHmac.length).toBe(PANJANG_KUNCI);
    // Domain separation: key untuk AEAD tidak boleh sama dengan key untuk HMAC
    expect(keyAead.equals(keyHmac)).toBe(false);
  });

  it('[KUNCI TIDAK VALID] kunci dengan panjang tidak sesuai melempar KunciTidakValid', () => {
    expect(() => muatKunciMaster('kunci_pendek')).toThrow(KunciTidakValid);
    // Pesan error tidak boleh membocorkan isi kunci
    try {
      muatKunciMaster('kunci_pendek');
    } catch (err) {
      expect((err as Error).message).not.toContain('kunci_pendek');
    }
  });

  it('[VALIDASI ALLOWLIST] menolak catatan produk dengan field liar / tidak sah', () => {
    const produkIlegal = {
      ...CONTOH_PRODUK_SAH,
      hacker_field: 'injeksi data',
    };
    expect(() => validasiCatatanProduk(produkIlegal)).toThrow(MasukanTidakValid);
  });

  it('[VALIDASI HARGA] menolak harga negatif atau NaN (fail-closed)', () => {
    const produkHargaNegatif = { ...CONTOH_PRODUK_SAH, harga: -50000 };
    expect(() => validasiCatatanProduk(produkHargaNegatif)).toThrow(MasukanTidakValid);

    const produkHargaNan = { ...CONTOH_PRODUK_SAH, harga: Number.NaN };
    expect(() => validasiCatatanProduk(produkHargaNan)).toThrow(MasukanTidakValid);
  });

  it('[VALIDASI FORMAT ID] menolak id_produk yang tidak sesuai format allowlist', () => {
    const produkIdCacat = { ...CONTOH_PRODUK_SAH, id_produk: 'drn-mkg-01' };
    expect(() => validasiCatatanProduk(produkIdCacat)).toThrow(MasukanTidakValid);
  });
});

// ─────────────────────────────────────────────────────────────
// KELOMPOK 5: UJI SAMBUNGAN ANTAR-KOMPONEN (T1 -> T2 INTEGRATION)
// ─────────────────────────────────────────────────────────────
describe('Kelompok 5: Uji Sambungan Antar-Komponen (T1 -> T2 Integration)', () => {
  it('[SAMBUNGAN T1 -> T2] kanonisasi JSON T1 menjamin urutan properti acak tetap valid saat didekripsi', () => {
    // Properti ditulis dalam urutan berbeda
    const produkUrutanLain = {
      waktu_panen: '2026-11-07T07:00',
      harga: 180000,
      stok_rahasia: 45,
      nama: 'Durian Musang King Super Kampar',
      kategori: 'premium' as const,
      id_produk: 'DRN-MKG-001',
    };

    // Enkripsi melewati kanonisasiJson() dari T1
    const paket = enkripsiProdukAead(produkUrutanLain);
    const hasil = dekripsiProdukAead(paket, 'DRN-MKG-001');

    // Kanonisasi menghasilkan byte konsisten dan rekonsiliasi data sempurna
    expect(hasil).toEqual(CONTOH_PRODUK_SAH);
  });

  it('[INTEGRITAS KANONIKAL] dua objek dengan urutan kunci berbeda menghasilkan JSON kanonis yang identik', () => {
    const objA = { z: 1, a: 2, m: { y: 10, x: 20 } };
    const objB = { a: 2, m: { x: 20, y: 10 }, z: 1 };

    expect(kanonisasiJson(objA)).toBe(kanonisasiJson(objB));
    expect(kanonisasiJson(objA)).toBe('{"a":2,"m":{"x":20,"y":10},"z":1}');
  });
});
