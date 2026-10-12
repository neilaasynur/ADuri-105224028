# AI_LOG.md — Catatan Penggunaan AI Generatif

Dokumen ini mencatat seluruh penggunaan AI generatif dalam pengerjaan
komponen kriptografi proyek **ADuri**.

---

## Log Penggunaan

| # | Alat AI | Tujuan | Ringkasan Perintah | Bagian yang Dipakai / Diubah | Cara Memverifikasi |
|---|---------|--------|--------------------|------------------------------|--------------------|
| 1 | Google Antigravity (Gemini) | Mengidentifikasi data sensitif yang perlu dilindungi di website penjualan | "dalam web saya ini, penggunaan yang sesuai untuk menyelaraskan dengan kriptografi ini apa ya?" | Pemetaan data sensitif (password, nomor rekening, nomor HP, alamat) ke teknik kriptografi yang sesuai → diverifikasi dan disesuaikan sendiri | Merujuk ke OWASP Top 10 dan dokumentasi bcryptjs untuk konfirmasi teknik yang dipilih |
| 2 | Google Antigravity (Gemini) | Memahami alur pengerjaan tugas secara keseluruhan | "bisakah kamu memberikan alur pengerjaan lengkap untuk menyelesaikan tugas ini?" | Struktur pengerjaan 6 langkah (README → crypto.ts → test → AI_LOG → .gitignore → git tag) → dipahami dan diikuti sendiri | Mencocokkan setiap langkah dengan rubrik penilaian K1–K5 |
| 3 | Google Antigravity (Gemini) | Menyusun konten README.md termasuk tabel kebutuhan dan rancangan komponen | "bisakah kamu memberikan format pengisian readme.md nya?" | Seluruh isi README.md (deskripsi produk, tabel kebutuhan 4 baris, rancangan 3 komponen) → dipahami tiap barisnya | Memeriksa kesesuaian format tabel Markdown dan relevansi teknik kriptografi dengan kebutuhan proyek |
| 4 | Google Antigravity (Gemini) | Implementasi fungsi kriptografi di lib/crypto.ts | "boleh lanjut ke step 2" | Seluruh isi lib/crypto.ts (6 fungsi: hashPassword, verifyPassword, encryptData, decryptData, generateOrderHMAC, verifyOrderHMAC) → dipahami tiap fungsi dan bisa dijelaskan | Membaca dokumentasi resmi Node.js crypto API dan bcryptjs, lalu menjalankan npm test untuk konfirmasi |
| 5 | Google Antigravity (Gemini) | Setup Vitest dan penulisan skenario uji otomatis | "okei, boleh lanjut ke step 3" | Konfigurasi vitest.config.mts dan seluruh isi __tests__/crypto.test.ts (8 skenario uji) → dipahami setiap assertion-nya | Menjalankan npm test → 8/8 skenario lulus |

---

## Pernyataan

Seluruh kode dan dokumentasi yang dikumpulkan dalam repositori ini telah
dipelajari, dipahami, dan mampu dijelaskan secara mandiri oleh penulis.
Penggunaan AI hanya sebagai alat bantu pemahaman, bukan pengganti pemahaman.

---

*Dibuat oleh: [Nama Kamu] — [NIM Kamu]*
