# AI_LOG.md — Catatan Penggunaan AI Generatif

Dokumen ini mencatat seluruh penggunaan AI generatif dalam pengerjaan
komponen kriptografi proyek **ADuri**.

---

## Log Penggunaan

| # | Alat AI | Tujuan | Ringkasan Perintah | Bagian yang Dipakai / Diubah | Cara Memverifikasi |
|---|---------|--------|--------------------|------------------------------|--------------------|
| 1 | Google Antigravity (Gemini) | Mengidentifikasi data sensitif yang perlu dilindungi di website penjualan | "dalam web saya ini, penggunaan yang sesuai untuk menyelaraskan dengan kriptografi ini apa ya?" | Pemetaan data sensitif (password, nomor rekening, nomor HP, alamat) ke teknik kriptografi yang sesuai → diverifikasi dan disesuaikan sendiri | Merujuk ke OWASP Top 10 dan dokumentasi bcryptjs untuk konfirmasi teknik yang dipilih |
| 2 | Google Antigravity (Gemini) | Memahami alur pengerjaan tugas secara keseluruhan | "bisakah kamu memberikan alur pengerjaan lengkap untuk menyelesaikan tugas ini?" | Struktur pengerjaan 6 langkah (README → crypto.ts → test → AI_LOG → .gitignore → git tag) → dipahami dan diikuti sendiri | Mencocokkan setiap langkah dengan rubrik penilaian K1–K5 |

---

## Pernyataan

Seluruh kode dan dokumentasi yang dikumpulkan dalam repositori ini telah
dipelajari, dipahami, dan mampu dijelaskan secara mandiri oleh penulis.
Penggunaan AI hanya sebagai alat bantu pemahaman, bukan pengganti pemahaman.

---

*Dibuat oleh: Neila Faaizah Asynur — 105224028*
