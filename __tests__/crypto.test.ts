/**
 * __tests__/crypto.test.ts
 * Uji otomatis komponen kriptografi ADuri
 *
 * Skenario uji:
 *  1. [POSITIF] hashPassword() menghasilkan hash bcrypt yang valid
 *  2. [POSITIF] verifyPassword() mengembalikan true untuk password yang benar
 *  3. [NEGATIF] verifyPassword() mengembalikan false untuk password yang salah
 *  4. [POSITIF] encryptData() dan decryptData() mengembalikan data asli
 *  5. [NEGATIF] verifyOrderHMAC() mengembalikan false jika payload dimanipulasi
 *  6. [BATAS]   hashPassword() melempar error jika input kosong
 */

import { describe, it, expect } from 'vitest'
import {
  hashPassword,
  verifyPassword,
  encryptData,
  decryptData,
  generateOrderHMAC,
  verifyOrderHMAC,
} from '../lib/crypto'

// ─────────────────────────────────────────────────────────────
// Kelompok 1: Hash & Verifikasi Password
// ─────────────────────────────────────────────────────────────
describe('Hash Password (bcrypt)', () => {

  // Skenario 1 — POSITIF
  it('menghasilkan hash bcrypt yang valid dari password plaintext', async () => {
    const hash = await hashPassword('DurianManis123')

    // Hash harus ada isinya (tidak kosong)
    expect(hash).toBeDefined()
    expect(hash.length).toBeGreaterThan(0)

    // Format bcrypt selalu diawali dengan $2b$ (versi bcrypt modern)
    expect(hash.startsWith('$2b$')).toBe(true)

    // Hash bcrypt selalu tepat 60 karakter
    expect(hash.length).toBe(60)
  })

  // Skenario 2 — POSITIF
  it('mengembalikan true jika password yang diverifikasi benar', async () => {
    const password = 'DurianManis123'
    const hash = await hashPassword(password)

    const hasil = await verifyPassword(password, hash)

    expect(hasil).toBe(true)
  })

  // Skenario 3 — NEGATIF ❌
  it('mengembalikan false jika password yang diverifikasi salah', async () => {
    const hash = await hashPassword('DurianManis123')

    // Coba verifikasi dengan password yang berbeda
    const hasil = await verifyPassword('PasswordSalah999', hash)

    expect(hasil).toBe(false)
  })

  // Skenario 6 — BATAS
  it('melempar error jika input password adalah string kosong', async () => {
    // Fungsi harus menolak input kosong dengan melempar Error
    await expect(hashPassword('')).rejects.toThrow('Password harus berupa string yang tidak kosong')
  })

})

// ─────────────────────────────────────────────────────────────
// Kelompok 2: Enkripsi & Dekripsi Data Pribadi
// ─────────────────────────────────────────────────────────────
describe('Enkripsi Data Pribadi (AES-256-GCM)', () => {

  // Skenario 4 — POSITIF
  it('dapat mengenkripsi lalu mendekripsi kembali ke data asli', () => {
    // Data sintetis — bukan data asli
    const nomorHP = '081200000000'

    const terenkripsi = encryptData(nomorHP)

    // Hasil enkripsi harus berbeda dari aslinya
    expect(terenkripsi).not.toBe(nomorHP)

    // Format harus iv:authTag:ciphertext (3 bagian dipisah ':')
    const bagian = terenkripsi.split(':')
    expect(bagian.length).toBe(3)

    // Setelah didekripsi harus kembali ke nilai semula
    const terdekripsi = decryptData(terenkripsi)
    expect(terdekripsi).toBe(nomorHP)
  })

  // Skenario BATAS — enkripsi dua kali menghasilkan output berbeda (IV acak)
  it('menghasilkan ciphertext berbeda setiap kali enkripsi (IV acak)', () => {
    const data = 'Jalan Durian No.1, Pekanbaru'

    const enkripsi1 = encryptData(data)
    const enkripsi2 = encryptData(data)

    // Walaupun datanya sama, hasil enkripsi harus berbeda karena IV acak
    expect(enkripsi1).not.toBe(enkripsi2)

    // Tapi keduanya harus bisa didekripsi ke nilai asli
    expect(decryptData(enkripsi1)).toBe(data)
    expect(decryptData(enkripsi2)).toBe(data)
  })

})

// ─────────────────────────────────────────────────────────────
// Kelompok 3: Integritas Pesanan (HMAC-SHA256)
// ─────────────────────────────────────────────────────────────
describe('Integritas Pesanan (HMAC-SHA256)', () => {

  // Skenario POSITIF — HMAC valid untuk pesanan yang sama
  it('menghasilkan signature yang cocok untuk pesanan yang sama', () => {
    const pesanan = { item: 'Durian Montong', qty: 2, total: 150000, userId: 'user-001' }

    const signature = generateOrderHMAC(pesanan)
    const valid = verifyOrderHMAC(pesanan, signature)

    expect(valid).toBe(true)
  })

  // Skenario 5 — NEGATIF ❌
  it('mengembalikan false jika payload pesanan dimanipulasi', () => {
    const pesananAsli = { item: 'Durian Montong', qty: 2, total: 150000, userId: 'user-001' }
    const signature = generateOrderHMAC(pesananAsli)

    // Simulasi manipulasi: total harga diubah dari 150000 ke 1500
    const pesananManipulasi = { item: 'Durian Montong', qty: 2, total: 1500, userId: 'user-001' }
    const valid = verifyOrderHMAC(pesananManipulasi, signature)

    // Harus gagal — segel tidak cocok dengan pesanan yang diubah
    expect(valid).toBe(false)
  })

})
