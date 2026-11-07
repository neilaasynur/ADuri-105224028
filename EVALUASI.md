# EVALUASI.md — Laporan Pengujian & Evaluasi Keamanan (Milestone v0.2)

Dokumen ini memuat catatan eksekusi pengujian otomatis, analisis hasil uji positif dan negatif, temuan keamanan, perbaikan yang dilakukan, serta evaluasi kesiapan demonstrasi pada **Tugas 2 (Milestone v0.2)** untuk proyek **ADuri — Website Penjualan Durian Keluarga Asynur**.

---

## 1. Ringkasan Eksekusi Pengujian Otomatis

Pengujian dijalankan menggunakan kerangka kerja **Vitest (Node.js Environment)** secara otomatis dari terminal:

```bash
# Perintah pengujian dari klon bersih:
npm test
# atau khusus modul kriptografi:
npx vitest run __tests__/crypto.test.ts
```

### Rekapitulasi Hasil Uji:
* **Total Skenario Uji Kriptografi:** 19 Uji
* **Status:** 19 Berhasil (*100% Passed*), 0 Gagal (*Failed*), 0 Dilewati (*Skipped*)
* **Rasio Keberhasilan:** Memenuhi ketentuan minimum ($\ge 4$ skenario, $\ge 3$ berhasil).

---

## 2. Tabel Rincian Skenario Uji (K1–K5)

| ID Uji | Kelompok & Skenario | Jenis Uji | Masukan / Kondisi | Harapan Sistem (Expected Outcome) | Hasil Aktual | Status |
|:--:|:---|:---:|:---|:---|:---:|:---:|
| **U-01** | Hash Password Bcrypt | Positif | String `'DurianKamparManis123'` | Menghasilkan hash 60 char berawalan `$2b$` | Format `$2b$12$...` valid | **LULUS** ✅ |
| **U-02** | Verifikasi Password Sah | Positif | Plaintext benar + Hash tersimpan | Mengembalikan `true` | Nilai `true` | **LULUS** ✅ |
| **U-03** | Verifikasi Password Salah | Negatif | Plaintext salah `'PasswordSalah123'` | Mengembalikan `false` | Nilai `false` | **LULUS** ✅ |
| **U-04** | Validasi Password Kosong | Negatif (Batas) | String kosong `""` | Melempar `MasukanTidakValid` | Galat dilempar (*fail-closed*) | **LULUS** ✅ |
| **U-05** | Integritas Pesanan (HMAC) | Positif | Payload pesanan sah | Tanda tangan 64 char valid | Terverifikasi `true` | **LULUS** ✅ |
| **U-06** | Manipulasi Harga Pesanan | Negatif | Total diubah 360000 $\to$ 3600 | Verifikasi tanda tangan gagal | Mengembalikan `false` | **LULUS** ✅ |
| **U-07** | **AEAD Enkripsi-Dekripsi (Skenario 1)** | **Positif** | Objek `CONTOH_PRODUK_SAH` + AAD `DRN-MKG-001` | Paket `iv:tag:cipher` didekripsi kembali utuh | Data asli identik | **LULUS** ✅ |
| **U-08** | **Ciphertext Diubah (Skenario 2)** | **Negatif** | 1 karakter hex pada ciphertext diubah | Melempar `AutentikasiGagal` (*fail-closed*) | Ditolak tegas | **LULUS** ✅ |
| **U-09** | **Tag Otentikasi Diubah (Skenario 3)** | **Negatif** | Karakter pertama Auth Tag diubah | Melempar `AutentikasiGagal` | Ditolak tegas | **LULUS** ✅ |
| **U-10** | **Relokasi Produk / AAD Salah (Skenario 4)**| **Negatif** | Paket didekripsi dengan AAD `DRN-LKL-002` | GMAC mendeteksi mismatch, melempar `AutentikasiGagal` | Ditolak tegas | **LULUS** ✅ |
| **U-11** | **Kunci Dekripsi Salah (Skenario 5)** | **Negatif** | Paket didekripsi dengan kunci acak lain | Melempar `AutentikasiGagal` | Ditolak tegas | **LULUS** ✅ |
| **U-12** | **Keacakan Nonce CSPRNG (Skenario 6)** | Karakteristik | Enkripsi 2x pada data identik | IV dan Ciphertext berbeda | Keduanya unik & dapat didekripsi | **LULUS** ✅ |
| **U-13** | Key Separation via HKDF | Positif | Master key diturunkan ke 2 tujuan | Sub-kunci AEAD $\ne$ Sub-kunci HMAC | Terbukti independen | **LULUS** ✅ |
| **U-14** | Kunci Tidak Valid Ditolak | Negatif | Kunci pendek (`'kunci_pendek'`) | Melempar `KunciTidakValid` tanpa bocor isi | Ditolak higienis | **LULUS** ✅ |
| **U-15** | Allowlist: Tolak Field Liar | Negatif | Catatan memuat `hacker_field` | Melempar `MasukanTidakValid` | Injeksi ditolak | **LULUS** ✅ |
| **U-16** | Allowlist: Tolak Harga Buruk | Negatif | Harga bernilai negatif atau `NaN` | Melempar `MasukanTidakValid` | Ditolak fail-closed | **LULUS** ✅ |
| **U-17** | Allowlist: Format ID Tidak Sah | Negatif | `id_produk` format kecil `'drn-mkg-01'` | Melempar `MasukanTidakValid` | Ditolak fail-closed | **LULUS** ✅ |
| **U-18** | **Sambungan T1 $\to$ T2 (Kanonikal)** | **Positif** | Objek dengan susunan key diacak | Byte kanonis identik, dekripsi utuh | Data pulih sempurna | **LULUS** ✅ |
| **U-19** | Bukti Deterministik Kanonis | Positif | Objek bersarang dengan urutan acak | Menghasilkan string JSON alfabetis | String identik | **LULUS** ✅ |

---

## 3. Temuan Keamanan & Perbaikan (*Findings & Remediation*)

### Temuan 1: Risiko *Key Reuse* Antara Enkripsi Simetris dan HMAC
* **Deskripsi Masalah:** Awalnya, ada kecenderungan menggunakan satu master key tunggal untuk operasi AES-256-GCM sekaligus kalkulasi tanda tangan HMAC pesanan. Secara kriptografi, menggunakan kunci yang sama untuk dua algoritma berbeda dapat memicu kelemahan matematis (*cross-primitive interaction*).
* **Perbaikan yang Dilakukan:** Mengintegrasikan fungsi **HKDF-SHA256 (RFC 5869)** pada `turunkanKunci()`. Dari satu master key di `.env.local`, sistem menurunkan dua sub-kunci 256-bit independen dengan info context berbeda:
  * `aduri v0.2 aead_produk` (khusus AEAD katalog)
  * `aduri v0.2 hmac_pesanan` (khusus HMAC transaksi)
* **Hasil Uji:** Terverifikasi pada pengujian `U-13` bahwa kedua sub-kunci berbeda secara kriptografis.

### Temuan 2: Pencegahan Serangan Pemindahan Data (*Relocation Attack*) via AAD
* **Deskripsi Masalah:** Jika hanya mengenkripsi payload tanpa AAD, penyerang yang memiliki akses ke basis data dapat menyalin string ciphertext durian lokal (Rp50.000) dan menimpakannya ke baris database durian Musang King premium (Rp180.000). Saat didekripsi, sistem akan mendekripsinya secara sah karena kuncinya sama.
* **Perbaikan yang Dilakukan:** Menggunakan `id_produk` (contoh: `DRN-MKG-001`) sebagai **Additional Authenticated Data (AAD)** pada AES-GCM. Tag otentikasi kini mengikat ciphertext ke ID produk.
* **Hasil Uji:** Terverifikasi pada pengujian `U-10` bahwa upaya mendekripsi paket dengan AAD durian lain seketika ditolak dengan galat `AutentikasiGagal`.

### Temuan 3: Penanganan Kegagalan Gagal Tertutup (*Fail-Closed*)
* **Deskripsi Masalah:** Kode kriptografi naif sering kali menangkap *exception* dengan blok `catch` kosong atau mengembalikan `null`, sehingga lapisan aplikasi tidak mengetahui adanya modifikasi data.
* **Perbaikan yang Dilakukan:** Seluruh error otentikasi dari OpenSSL dibungkus ke dalam kelas exception tersendiri `AutentikasiGagal` dan melempar error seketika. Tidak ada data parsial atau tebakan plaintext yang dibiarkan keluar.

---

## 4. Evaluasi Keterbatasan & Rencana Tugas 3 (Milestone v0.3)

Meskipun Milestone v0.2 telah memenuhi seluruh parameter kriptografi simetris, terdapat keterbatasan mendasar yang akan diselesaikan pada Tugas 3:
1. **Keterbatasan Nirsangkal (*Non-Repudiation*):**
   * Kunci simetris (AES dan HMAC) adalah *shared-secret*. Siapa pun yang memegang kunci (pihak backend atau staf gudang) secara teknis dapat memalsukan data karena memiliki kunci yang sama.
   * **Rencana Tugas 3:** Mengimplementasikan **kriptografi asimetris (kunci publik/privat)** menggunakan **Ed25519** atau **RSA/ECDSA** untuk tanda tangan digital pesanan durian yang memiliki kekuatan hukum nirsangkal.
2. **Distribusi & Rotasi Kunci:**
   * Saat ini kunci master masih dikelola manual via `.env.local`.
   * **Rencana Tugas 3/Pekan 11:** Menyiapkan alur manajemen siklus hidup kunci (*key lifecycle*): prosedur pembangkitan, rotasi berkala, dan pencabutan kunci yang terkompromi.

---

*Disusun oleh: Neila Faaizah Asynur — 105224028*  
*Repositori: ADuri-105224028 (Tag v0.2)*
