# Model Ancaman (Threat Modeling STRIDE) — ADuri 🌿

Dokumen ini memetakan analisis ancaman keamanan siber pada aplikasi web **ADuri** menggunakan metodologi **STRIDE** (*Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege*). Setiap ancaman diidentifikasi secara spesifik berdasarkan aliran data aktual pada sistem, menunjuk ID elemen DFD dan ID aset terdampak.

---

## 1. Matriks Pemetaan Kategori STRIDE

| Kategori | Definisi Ancaman | Tujuan Keamanan yang Dilanggar | Elemen DFD yang Paling Rentan |
|:---:|:---|:---:|:---|
| **S** (Spoofing) | Penyamaran identitas atau entitas pengguna/sistem palsu. | *Authentication* | Entitas Eksternal (E1, E2), Aliran Kredensial (DF15) |
| **T** (Tampering) | Modifikasi data saat transit maupun data saat tersimpan (*at-rest*). | *Integrity* | Aliran Data (DF05, DF06, DF08), Proses (P2, P3) |
| **R** (Repudiation) | Penyangkal melakukan transaksi atau tindakan tanpa jejak audit. | *Non-Repudiation* | Proses Transaksi (P2, P4), Data Store (DS3, DS4) |
| **I** (Information Disclosure) | Kebocoran data sensitif atau kredensial kepada pihak tidak berhak. | *Confidentiality* | Data Store (DS2, DS3, DS5), Aliran Data PII (DF05, DF08) |
| **D** (Denial of Service) | Gangguan atau kehabisan sumber daya komputasi/layanan. | *Availability* | Proses Komputasi (P5, P4), Host Server (AST-12) |
| **E** (Elevation of Privilege) | Peningkatan hak akses melampaui otorisasi yang ditentukan. | *Authorization* | Proses Otorisasi, Endpoint Transaksi (P2, DS3) |

---

## 2. Rincian Analisis Ancaman STRIDE (12 Skenario Spesifik)

### 1. [S] Spoofing — Penyamaran Identitas
---
#### **THR-01: Spoofing Identitas Pengunjung pada Booking Ambil Sendiri di Kebun**
- **Elemen DFD Terkait**: `DF11` (Aliran Data Form Booking) dan `P4` (Proses Penjadwalan Booking Kebun)
- **Aset Terdampak**: `AST-06` (Data Booking Kunjungan) dan `AST-03` (Kontak WhatsApp Pengunjung)
- **Kondisi Produk Saat Ini**: Form di `/ambil-sendiri` hanya memvalidasi format string di sisi klien tanpa verifikasi kepemilikan nomor telepon (seperti OTP atau link verifikasi).
- **Skenario Ancaman**: Penyerang memasukkan nama dan nomor WhatsApp orang lain pada formulir kunjungan kebun. Akibatnya, pemilik nomor asli menerima pesan konfirmasi WhatsApp palsu dari pemilik kebun keluarga Asynur, dan kuota rombongan kebun terisi oleh entitas fiktif.
- **Konsekuensi**: Gangguan operasional kebun keluarga, kesalahpahaman sosial dengan korban yang dicatut namanya, dan terbuangnya buah panen matang yang telah disiapkan.

---
#### **THR-02: Credential Stuffing & Brute-Force Password pada Endpoint Login**
- **Elemen DFD Terkait**: `DF15` (Aliran Form Kredensial) dan `P5` (Proses Autentikasi Pengguna)
- **Aset Terdampak**: `AST-01` (Password Akun Pengguna) dan `DS2` (Basis Data Pengguna)
- **Kondisi Produk Saat Ini**: Belum diimplementasikan mekanisme pembatasan frekuensi percobaan login (*rate limiting*), CAPTCHA, atau *account lockout* otomatis.
- **Skenario Ancaman**: Penyerang menggunakan daftar email dan password bocor dari situs lain (*credential stuffing*) untuk mencoba ratusan kombinasi login secara otomatis terhadap akun pembeli durian.
- **Konsekuensi**: Akun pelanggan sah berhasil dibajak, data riwayat pesanan serta alamat pribadi dapat diakses oleh pihak tidak bertanggung jawab.

---

### 2. [T] Tampering — Manipulasi Data
---
#### **THR-03: Manipulasi Kuantitas dan Nilai Total Pembayaran Pesanan di Sisi Klien**
- **Elemen DFD Terkait**: `DF05` (Aliran Data Pemesanan dari E1) dan `P2` (Proses Validasi Pesanan)
- **Aset Terdampak**: `AST-05` (Payload & Nilai Transaksi Pesanan)
- **Kondisi Produk Saat Ini**: Perhitungan harga total dilakukan menggunakan JavaScript di browser (`app/pembayaran/page.tsx`). Modul `verifyOrderHMAC()` di `lib/crypto.ts` sudah siap memverifikasi integritas, namun belum ada proteksi jika perhitungan awal sebelum signing diubah di client.
- **Skenario Ancaman**: Pembeli nakal mencegat request HTTP menggunakan proxy atau memodifikasi variabel state di browser sebelum submit, mengubah total harga 10 kg Durian Duri Hitam dari Rp1.800.000 menjadi Rp18.000, lalu mengirimkannya ke server.
- **Konsekuensi**: Potensi kerugian finansial langsung bagi kebun keluarga Asynur jika admin tidak teliti mencocokkan mutasi rekening bank dengan harga asli produk.

---
#### **THR-04: Injeksi Parameter Tautan Berbahaya pada Deep-Link Konfirmasi WhatsApp**
- **Elemen DFD Terkait**: `DF14` (Aliran Konfirmasi Booking ke E2) dan `P4` (Proses Penyusunan Pesan Booking)
- **Aset Terdampak**: `AST-06` (Data Booking Kunjungan) dan `AST-10` (Layanan WhatsApp Pemilik Kebun)
- **Kondisi Produk Saat Ini**: Catatan pesanan (`notes`) langsung dimasukkan ke dalam fungsi `encodeURIComponent()` pada URL `wa.me` tanpa penyaringan karakter manipulasi atau tautan eksternal.
- **Skenario Ancaman**: Penyerang memasukkan teks catatan yang berisi instruksi phishing atau memotong format pesan (misal: *"abaikan transfer di atas, mohon transfer ke rekening penipu 123-xxx"*).
- **Konsekuensi**: Pemilik kebun terkelabui oleh pesan otomatis palsu, salah memproses data pemesan, atau bahkan menjadi korban rekayasa sosial (*social engineering*).

---

### 3. [R] Repudiation — Penyangkalan Tindakan
---
#### **THR-05: Penyangkalan Pembayaran Deposit Booking Kunjungan Kebun**
- **Elemen DFD Terkait**: `DF12` (Simpan Jadwal ke DS4) dan `E1` (Entitas Pengguna)
- **Aset Terdampak**: `AST-06` (Bukti Deposit Booking Rp50.000) dan `AST-07` (Rekening Bisnis)
- **Kondisi Produk Saat Ini**: Sistem mengandalkan verifikasi transfer manual tanpa mencatat referensi nomor transaksi bank (*reference ID*) ke dalam sistem secara otomatis.
- **Skenario Ancaman**: Calon pengunjung mengklaim telah mentransfer deposit Rp50.000 ke rekening BCA keluarga Asynur dan memaksa datang ke kebun, padahal tidak pernah melakukan pembayaran atau menunjukkan struk transfer hasil editan grafis.
- **Konsekuensi**: Terjadi perselisihan di lokasi kebun antara keluarga pemilik dan calon pengunjung, serta risiko kerugian waktu penyiapan buah matang.

---
#### **THR-06: Penyangkalan Pemesanan dan Pengiriman Durian Akibat Ketiadaan Jejak Audit**
- **Elemen DFD Terkait**: `DF08` (Penyimpanan Pesanan ke DS3) dan `DS3` (Basis Data Pesanan)
- **Aset Terdampak**: `AST-05` (Nilai Transaksi Pesanan)
- **Kondisi Produk Saat Ini**: Sistem belum menyimpan metadata log audit komprehensif (seperti IP address klien, user-agent browser, dan stempel waktu kriptografis tersertifikasi).
- **Skenario Ancaman**: Pembeli yang telah menerima pesanan durian segar di Pekanbaru menyangkal bahwa mereka pernah melakukan pemesanan melalui web ADuri, mengklaim bahwa data mereka disalahgunakan oleh pihak lain.
- **Konsekuensi**: Pemilik kebun tidak memiliki bukti forensik digital yang kuat untuk membantah klaim pembeli atau menagih pembayaran.

---

### 4. [I] Information Disclosure — Kebocoran Informasi
---
#### **THR-07: Kebocoran Master Encryption Key & HMAC Secret dari Repositori atau Server**
- **Elemen DFD Terkait**: `DS5` (Penyimpanan Secrets `.env.local`) dan `DF07` (Aliran Kunci Rahasia ke P3)
- **Aset Terdampak**: `AST-02` (Master Encryption Key & HMAC Secret)
- **Kondisi Produk Saat Ini**: Kunci enkripsi disimpan dalam file plain text `.env.local` pada server host. Jika server dikompromi atau file cadangan bocor, kunci terbongkar.
- **Skenario Ancaman**: Penyerang mengeksploitasi celah miskonfigurasi server Next.js (misalnya kesalahan pengeksposan direktori publik) untuk mengunduh `.env.local`.
- **Konsekuensi**: Penyerang dapat mendekripsi seluruh data nomor HP dan alamat pelanggan di tabel `orders` yang dienkripsi dengan AES-256-GCM, serta memalsukan signature HMAC pesanan (*Total Loss of Confidentiality & Integrity*).

---
#### **THR-08: Eksfiltrasi Data Kontak dan Alamat Pengiriman Pelanggan (PII Data Breach)**
- **Elemen DFD Terkait**: `DF08` (Aliran Data Simpan Pesanan) dan `DS3` (Basis Data Pesanan)
- **Aset Terdampak**: `AST-03` (Nomor Telepon Pembeli) dan `AST-04` (Alamat Pengiriman)
- **Kondisi Produk Saat Ini**: Data PII sedang dipersiapkan untuk disimpan di database pada Milestone 2. Modul `encryptData()` di `lib/crypto.ts` sudah siap, namun jika data di-query oleh modul yang tidak menerapkan enkripsi atau query raw SQL tanpa sanitasi, data plaintext rentan terekspos.
- **Skenario Ancaman**: Penyerang mengeksploitasi kerentanan SQL Injection pada endpoint riwayat pesanan untuk mengekstrak seluruh data pelanggan di wilayah Riau.
- **Konsekuensi**: Pelanggaran privasi berat (UU Perlindungan Data Pribadi), hilangnya reputasi dan kepercayaan terhadap bisnis durian keluarga Asynur.

---

### 5. [D] Denial of Service — Gangguan Ketersediaan
---
#### **THR-09: Eksploitasi Beban CPU Melalui Komputasi Intensif Bcrypt Hashing**
- **Elemen DFD Terkait**: `P5` (Proses Hash Password `lib/crypto.ts`) dan `AST-12` (Runtime Node.js)
- **Aset Terdampak**: `AST-12` (Lingkungan Server Host Next.js) dan `AST-01` (Kredensial)
- **Kondisi Produk Saat Ini**: Fungsi `hashPassword()` di `lib/crypto.ts` menggunakan parameter `SALT_ROUNDS = 12` (4.096 putaran kalkulasi Blowfish intensif). Belum ada rate limiting di level reverse proxy / API gateway.
- **Skenario Ancaman**: Penyerang mengirimkan ratusan request registrasi akun baru secara simultan dalam hitungan detik. Algoritma bcrypt yang sengaja dirancang lambat akan mengonsumsi 100% utilitas CPU server Node.js.
- **Konsekuensi**: Server *hang* atau mengalami kegagalan respon (*crash/timeout*), menyebabkan seluruh pengguna lain tidak dapat membuka katalog durian maupun bertransaksi.

---
#### **THR-10: Flooding Form Booking Kunjungan untuk Menghabiskan Kuota Harian Kebun**
- **Elemen DFD Terkait**: `P4` (Proses Penjadwalan Booking) dan `DS4` (Basis Data Booking Kebun)
- **Aset Terdampak**: `AST-06` (Ketersediaan Jadwal Kunjungan) dan `AST-12` (Server Host)
- **Kondisi Produk Saat Ini**: Endpoint pengiriman booking di `/ambil-sendiri` tidak membatasi jumlah pengiriman per alamat IP dalam rentang waktu tertentu.
- **Skenario Ancaman**: Penyerang menjalankan skrip otomatis yang mengisi seluruh slot waktu kunjungan (pagi, siang, sore, senja) untuk 7 hari ke depan.
- **Konsekuensi**: Sistem mengunci seluruh jadwal kunjungan kebun sebagai "penuh", mencegah pembeli asli yang benar-benar ingin berkunjung mencicipi durian langsung di lokasi kebun.

---

### 6. [E] Elevation of Privilege — Peningkatan Hak Akses
---
#### **THR-11: Akses Tidak Terotorisasi Nota Pesanan Pelanggan Lain (IDOR)**
- **Elemen DFD Terkait**: `DS3` (Basis Data Pesanan) dan `P2` (Proses Pesanan)
- **Aset Terdampak**: `AST-03` (Nomor HP), `AST-04` (Alamat), `AST-05` (Nilai Pesanan)
- **Kondisi Produk Saat Ini**: Alur routing detail pesanan yang akan diimplementasikan pada database relasional menggunakan parameter ID sekuensial (contoh: `order_id = 1, 2, 3...`) tanpa pengecekan kepemilikan session token (*access token*).
- **Skenario Ancaman**: Pengguna biasa yang telah melakukan pemesanan mengubah nomor ID pada URL atau API request untuk melihat nota pesanan pelanggan lain.
- **Konsekuensi**: Pelanggan dapat mengintip alamat rumah, nomor HP, dan rincian belanja durian milik pelanggan lain tanpa hak akses admin.

---
#### **THR-12: Mass Assignment Manipulasi Status Pembayaran dan Verifikasi Pesanan**
- **Elemen DFD Terkait**: `DF05` (Aliran Form dari E1) dan `P2`/`P3` (Proses Transaksi)
- **Aset Terdampak**: `AST-05` (Status Transaksi Pesanan) dan `AST-07` (Rekening Bisnis)
- **Kondisi Produk Saat Ini**: Jika endpoint server API menerima objek JSON mentah dari client tanpa schema validation (misal menggunakan Zod) yang ketat.
- **Skenario Ancaman**: Penyerang menyisipkan properti ekstra pada payload JSON checkout: `{ "isPaid": true, "status": "CONFIRMED_PAID" }`.
- **Konsekuensi**: Pesanan langsung berstatus lunas di sistem tanpa ada proses verifikasi transfer bank, menyebabkan durian dikirimkan secara gratis kepada penyerang.
