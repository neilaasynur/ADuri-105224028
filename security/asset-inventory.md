# Inventaris Aset Produk (Asset Inventory) — ADuri 🌿

Dokumen ini mencatat seluruh inventaris aset (data, perangkat lunak, kredensial, infrastruktur, dan layanan eksternal) pada aplikasi web **ADuri** (platform penjualan durian kebun keluarga Asynur di wilayah Riau). Inventaris ini diselaraskan dengan produk yang saat ini berjalan serta rencana pengembangan pada *milestone* berikutnya.

---

## 1. Klasifikasi Tingkat Sensitivitas Aset
Untuk menentukan prioritas perlindungan, setiap aset diklasifikasikan berdasarkan standar kerahasiaan (*Confidentiality*), integritas (*Integrity*), dan ketersediaan (*Availability*):
- **Tinggi (T)**: Kompromi pada aset ini berakibat fatal pada privasi pelanggan, kerugian finansial langsung, atau pelanggaran regulasi perlindungan data pribadi (UU PDP).
- **Sedang (S)**: Kompromi berdampak pada operasional bisnis atau ketidaknyamanan pengguna, namun tidak mengekspos data kredensial/rahasia fatal.
- **Rendah (R)**: Informasi publik yang dapat diakses secara terbuka tanpa risiko keamanan langsung.

---

## 2. Tabel Inventaris Aset

| ID Aset | Nama Aset | Kategori | Deskripsi & Lokasi | C | I | A | Mekanisme Perlindungan Saat Ini | Target Perlindungan (Tugas 2/3) |
|:---:|:---|:---|:---|:---:|:---:|:---:|:---|:---|
| **AST-01** | Password Akun Pengguna | Data Kredensial | Kata sandi akun pembeli untuk login ke sistem web ADuri (disimpan di tabel `users.password_hash`). | **T** | **T** | S | **Kriptografi**: Di-hash dengan `bcryptjs` (salt 128-bit acak, *cost factor* 12 = 4.096 putaran). | Validasi kekuatan password, rate limiting autentikasi, lockout policy. |
| **AST-02** | Master Encryption Key & HMAC Secret | Rahasia Sistem (*Secrets*) | Kunci enkripsi simetrik 256-bit (`ENCRYPTION_KEY`) dan kunci penandatangan pesan (`HMAC_SECRET`) pada `.env.local`. | **T** | **T** | **T** | Terisolasi di server-side, di-exclude dari Git via `.gitignore`, template aman via `.env.example`. | *Secret Management Service* / Vault, rotasi kunci berkala. |
| **AST-03** | Data Kontak Pribadi (Nomor HP / WhatsApp) | Data PII (*Personally Identifiable Information*) | Nomor WhatsApp pelanggan untuk koordinasi pengiriman durian dan konfirmasi booking kunjungan (`app/pembayaran` & `app/ambil-sendiri`). | **T** | **T** | S | Validasi regex `08...`, komponen kriptografi `encryptData()` menggunakan **AES-256-GCM** dengan IV 96-bit unik. | Enkripsi *at-rest* di database SQLite/PostgreSQL, masking nomor di tampilan antarmuka. |
| **AST-04** | Alamat Fisik Pengiriman Pelanggan | Data PII | Alamat rumah/kantor pelanggan di area Pekanbaru, Kampar, Siak, Pelalawan, dan sekitarnya. | **T** | **T** | S | Komponen kriptografi `encryptData()` (**AES-256-GCM** menghasilkan ciphertext + authentication tag 128-bit). | Kontrol akses berbasis peran (*Role-Based Access Control* / RBAC) agar hanya kurir/admin terverifikasi yang membaca. |
| **AST-05** | Payload & Nilai Transaksi Pesanan | Data Transaksi | Rincian varietas durian, kuantitas (kg/buah), subtotal, dan total pembayaran pesanan. | S | **T** | **T** | Komponen kriptografi `generateOrderHMAC()` & `verifyOrderHMAC()` menggunakan **HMAC-SHA256** untuk menjamin integritas. | Validasi harga *server-side* mutlak (menolak payload harga yang dimodifikasi di client), *idempotency key*. |
| **AST-06** | Data Booking Kunjungan Kebun & Bukti Deposit | Data Operasional | Jadwal kunjungan, jam kedatangan, jumlah rombongan, catatan pesanan, dan status deposit booking Rp50.000. | S | **T** | **T** | Validasi input form di client (`app/ambil-sendiri/page.tsx`), verifikasi deposit manual via WhatsApp pemilik kebun. | Penyimpanan tabel `bookings` di database relasional, verifikasi otomatis mutasi bank/QRIS. |
| **AST-07** | Nomor Rekening Bank Kebun Keluarga Asynur | Data Finansial Bisnis | Nomor rekening BCA (893-0192-881 a.n. Kebun Durian Riau) yang ditampilkan di halaman pembayaran dan deposit. | S | **T** | S | Dikelola terpusat di `data/products.ts` dan di-render statis di komponen server/klien. | *Integrity monitoring* kode sumber untuk mencegah serangan *defacement* / penggantian nomor rekening penipu. |
| **AST-08** | Katalog Produk & Harga Durian | Data Publik | Informasi varietas (Montong, Kampung, Tembaga, Duri Hitam), foto, harga/kg, tingkat kemanisan, dan stok di `data/products.ts`. | R | **T** | **T** | Kode sumber statis bertipe TypeScript (`Product[]`), dibundle via Next.js Turbopack. | Database relasional dengan skema terindeks, caching CDN, CMS admin dengan autentikasi multi-faktor. |
| **AST-09** | Kode Sumber Aplikasi & Komponen Kriptografi | Perangkat Lunak | Seluruh logika aplikasi Next.js 16, modul `lib/crypto.ts`, unit test `__tests__/crypto.test.ts`, dan komponen antarmuka. | S | **T** | **T** | Pengendalian versi Git terpusat di GitHub, automated test Vitest (8 skenario lulus). | CI/CD pipeline, SAST (*Static Application Security Testing*), pemindaian dependensi (npm audit). |
| **AST-10** | Layanan Komunikasi Eksternal (WhatsApp Gateway) | Layanan Pihak Ketiga | Kanal komunikasi konfirmasi pemesanan dan booking kebun langsung ke nomor pemilik kebun (6281234567890 via `wa.me`). | S | S | **T** | Tautan deep-link URI encoded dengan parameter pesan terstruktur. | Integrasi WhatsApp Business API resmi dengan webhook berautentikasi dan pencatatan log pesan. |
| **AST-11** | Layanan Pemetaan Lokasi (Google Maps) | Layanan Pihak Ketiga | Titik koordinat kebun keluarga di Kampar, Riau via tautan `maps.app.goo.gl/5U3uggCfscyyxQyg8`. | R | S | S | Tautan eksternal aman HTTPS dengan atribut `rel="noopener noreferrer"`. | Peta interaktif tersemat (*embedded map*) dengan API Key yang dibatasi kuota dan domain (*referrer restriction*). |
| **AST-12** | Lingkungan Server / Runtime Node.js | Infrastruktur Host | Lingkungan eksekusi Next.js App Router (Node.js runtime) tempat `lib/crypto.ts` dan route handler dijalankan. | **T** | **T** | **T** | Konfigurasi server modern, isolasi `node_modules`, Turbopack bundler. | Hardening HTTP security headers (CSP, HSTS, X-Content-Type-Options), proteksi DDoS Cloudflare/Vercel. |

---

## 3. Ringkasan Aset yang Dilindungi Kriptografi

| Aset | Algoritma Kriptografi | Pustaka Terpelihara | Fungsi dalam Produk ADuri |
|:---|:---|:---|:---|
| **AST-01 (Password Pengguna)** | bcrypt (Blowfish, Cost 12) | `bcryptjs` (v3.0+) | Mencegah pembacaan password plaintext sekalipun database bocor (*Confidentiality*). |
| **AST-03 & AST-04 (Kontak HP & Alamat PII)** | AES-256-GCM (Authenticated Encryption) | Node.js built-in `crypto` (`createCipheriv`) | Melindungi privasi pelanggan saat disimpan di server dan database (*Confidentiality & Authenticity*). |
| **AST-05 (Payload Pesanan Durian)** | HMAC-SHA256 | Node.js built-in `crypto` (`createHmac`) | Mencegah pembeli nakal memanipulasi kuantitas, harga durian, atau total bayar (*Integrity & Tamper Detection*). |
| **AST-02 (Kunci Kriptografi & Rahasia)** | Entropi Tinggi / Acak Kriptografis | Node.js `crypto.randomBytes(32)` | Menjadi basis keamanan simetrik AES dan HMAC, dijaga melalui file environment terisolasi. |
