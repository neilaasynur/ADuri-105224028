# AI_LOG.md — Catatan Penggunaan AI Generatif

Dokumen ini mencatat seluruh penggunaan AI generatif dalam pengerjaan komponen kriptografi, arsitektur aliran data, permodelan ancaman (STRIDE), dan manajemen risiko keamanan pada proyek **ADuri** (Kebun Durian Keluarga Asynur).

---

## Log Penggunaan

| # | Alat AI | Tujuan | Ringkasan Perintah | Bagian yang Dipakai / Diubah | Cara Memverifikasi |
|:---:|:---|:---|:---|:---|:---|
| 1 | Google Antigravity (Gemini) | Mengidentifikasi data sensitif yang perlu dilindungi di website penjualan | "dalam web saya ini, penggunaan yang sesuai untuk menyelaraskan dengan kriptografi ini apa ya?" | Pemetaan data sensitif (password, nomor rekening, nomor HP, alamat) ke teknik kriptografi yang sesuai → diverifikasi dan disesuaikan sendiri | Merujuk ke OWASP Top 10 dan dokumentasi bcryptjs untuk konfirmasi teknik yang dipilih |
| 2 | Google Antigravity (Gemini) | Memahami alur pengerjaan tugas secara keseluruhan | "bisakah kamu memberikan alur pengerjaan lengkap untuk menyelesaikan tugas ini?" | Struktur pengerjaan 6 langkah (README → crypto.ts → test → AI_LOG → .gitignore → git tag) → dipahami dan diikuti sendiri | Mencocokkan setiap langkah dengan rubrik penilaian K1–K5 |
| 3 | Google Antigravity (Gemini) | Merancang Diagram Aliran Data (DFD Level 1) dan Trust Boundary | "Gambar DFD dengan ID elemen dan minimal dua trust boundary; tandai aset data yang dilindungi kriptografi" | Dokumen `dfd.md` memuat diagram Mermaid dengan 4 entitas eksternal, 5 proses, 5 data store, 16 aliran data, 3 trust boundary, dan tanda khusus aset kriptografi | Memeriksa kelengkapan ID elemen (E1-E4, P1-P5, DS1-DS5, DF01-DF16, TB1-TB3) dan validitas diagram Mermaid |
| 4 | Google Antigravity (Gemini) | Melakukan permodelan ancaman menggunakan metodologi STRIDE | "Tulis minimal 10 threat STRIDE di threat-model.md, masing-masing menunjuk elemen DFD dan aset terdampak" | Dokumen `threat-model.md` berisi 12 ancaman spesifik (non-generik) mencakup kategori S, T, R, I, D, E beserta kondisi produk riil dan konsekuensinya | Memastikan setiap ancaman menunjuk ID elemen DFD dan ID aset secara presisi tanpa kalimat abstrak generik |
| 5 | Google Antigravity (Gemini) | Menyusun matriks risiko kemungkinan-dampak dan rencana kontrol | "Nilai kemungkinan dan dampak setiap threat dengan alasan dari kondisi produk, lalu pilih lima risiko prioritas di risk-register.md... petakan ke Tugas 2 atau Tugas 3" | Dokumen `risk-register.md` memuat penilaian risiko 12 ancaman dengan alasan spesifik, penetapan 5 risiko prioritas, serta rencana kontrol teknis yang dipetakan ke Tugas 2 & 3 | Memeriksa formula risiko (Kemungkinan × Dampak), justifikasi non-generik, dan keterkaitan kontrol dengan demonstrasi |

---

## Pernyataan Integritas Akademik

Seluruh kode, dokumentasi arsitektur, dan analisis ancaman keamanan siber yang dikumpulkan dalam repositori ini telah dipelajari, dipahami secara mendalam, dan mampu dijelaskan secara mandiri oleh penulis pada saat sesi demonstrasi. Penggunaan AI generatif dimanfaatkan sebagai sarana asistensi perancangan dan penataan dokumentasi, bukan pengganti pemahaman konseptual.

---

*Dibuat oleh: Neila Faaizah Asynur — 105224028*
