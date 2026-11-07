# ADuri 

> **Fresh from our garden, straight to you.**  
> Platform e-commerce penjualan durian hasil kebun keluarga Asynur untuk wilayah Riau.

---

## 📌 Bagian 1: Konsep & Dokumentasi Produk (Milestone 1)

### 1. Deskripsi Produk
**ADuri** adalah aplikasi web e-commerce yang memfasilitasi penjualan buah durian segar langsung dari kebun keluarga Asynur di wilayah Riau. Aplikasi ini menghubungkan pemilik kebun keluarga langsung dengan konsumen tanpa perantara tengkulak.

### 2. Permasalahan yang Ingin Diselesaikan
1. **Keterbatasan Jangkauan Pasar Kebun Keluarga**: Penjualan hasil panen kebun durian keluarga Asynur sebelumnya masih mengandalkan relasi sekitar dan pemasaran mulut-ke-mulut konvensional. Dibutuhkan saluran digital terpusat untuk memperluas jangkauan pasar ke seluruh penjuru Riau agar kapasitas panen terserap optimal.
2. **Ketidakpastian Kualitas Durian**: Pembeli di pasaran sering kesulitan mendapatkan durian yang terjamin manis legit dan tidak hambar.
3. **Keterbatasan Akses Kebun Langsung**: Sulitnya pembeli kota mendapatkan buah segar yang baru dipetik di hari yang sama.
4. **Risiko Manipulasi Pesanan & Keamanan Data**: Pembelian melalui pesan chat konvensional rentan salah hitung nota, manipulasi jumlah transfer, dan kebocoran kontak pribadi.
5. **Pencatatan Transaksi Manual & Keamanan Data**: Pemesanan konvensional lewat pesan instan rentan kesalahan pencatatan pesanan, salah hitung nota, risiko manipulasi bukti pembayaran, serta kebocoran data pribadi pelanggan.

### 3. Sasaran Pengguna
- Pecinta buah durian di area Provinsi Riau.
- Keluarga dan perorangan yang ingin membeli oleh-oleh khas durian segar berkualitas tinggi.
- Penikmat durian premium dengan garansi buah manis.

### 4. Fitur Awal Produk
- **Katalog & Spesifikasi Produk**: Menampilkan daftar varietas durian lengkap dengan foto, harga, satuan, tingkat kemanisan, kepahitan, dan ketebalan daging buah.
- **Navigasi & Pencarian Rinci**: Halaman beranda, katalog semua varietas, dan detail produk dinamis berdasarkan slug.
- **Formulir Pemesanan & Validasi Sisi Klien**: Form pemesanan responsif dengan validasi otomatis (nama minimal 3 karakter, nomor WhatsApp format 08... minimal 10 digit, dan alamat lengkap minimal 10 karakter) serta pesan kesalahan visual.
- **Pilihan Pembayaran Beragam**: Simulasi instruksi pembayaran melalui Transfer Bank (TF) dan QRIS.

### 5. Teknologi yang Digunakan
- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Kriptografi**: Node.js `crypto` & `bcryptjs`
- **Testing**: [Vitest](https://vitest.dev/)

### 6. Struktur Folder Aplikasi
```
projek-web/
├── app/
│   ├── layout.tsx                # Root layout & font setting
│   ├── page.tsx                  # Halaman Beranda (Hero, Featured, Info)
│   ├── produk/
│   │   ├── page.tsx              # Halaman Katalog Seluruh Produk
│   │   └── [slug]/page.tsx       # Halaman Detail Spesifikasi Produk (Dinamis)
│   ├── pembayaran/
│   │   └── page.tsx              # Halaman Formulir Pemesanan & Pembayaran
│   └── ambil-sendiri/
│       └── page.tsx              # Halaman Booking Kunjungan Kebun & Deposit
├── components/
│   ├── Navbar.tsx                # Reusable Component: Navigasi Header
│   ├── Footer.tsx                # Reusable Component: Informasi Footer
│   ├── ProductCard.tsx           # Reusable Component: Kartu Durian
│   ├── ProductGallery.tsx        # Reusable Component: Galeri Foto Durian
│   └── ProductSpecification.tsx  # Reusable Component: Bar Indikator Rasa/Daging
├── data/
│   └── products.ts               # Mock Data produk durian & metode bayar
├── types/
│   └── durian.ts                 # Definisi antarmuka TypeScript
├── lib/
│   └── crypto.ts                 # Modul komponen kriptografi produk
├── __tests__/
│   └── crypto.test.ts            # Skenario uji otomatis (Vitest)
├── asset-inventory.md            # Inventarisasi aset data, software, & host
├── dfd.md                        # Data Flow Diagram Level 1 & Trust Boundaries
├── threat-model.md               # Analisis ancaman 12 skenario STRIDE
├── risk-register.md              # Penilaian risiko & rencana kontrol Tugas 2/3
└── AI_LOG.md                     # Catatan komprehensif penggunaan AI
```

---

## 🔐 Bagian 2: Kebutuhan Kriptografi Produk

| No | Data yang Dilindungi | Tujuan Keamanan | Teknik Kriptografi | Prioritas |
|:--:|----------------------|-----------------|-------------------|:---------:|
| 1 | Password akun pengguna | **Confidentiality** — password tidak boleh terbaca meski database bocor | Hashing (bcrypt, salt otomatis, cost factor 12) | Tinggi |
| 2 | Nomor rekening & nomor telepon pembeli | **Confidentiality** — data finansial dan kontak pribadi harus terlindungi | Enkripsi simetrik (AES-256-GCM) | Tinggi |
| 3 | Alamat pengiriman pembeli | **Confidentiality** — informasi lokasi fisik pembeli wajib dilindungi | Enkripsi simetrik (AES-256-GCM) | Tinggi |
| 4 | Integritas payload pesanan (item, harga, total) | **Integrity** — data pesanan tidak boleh dimanipulasi saat checkout | HMAC-SHA256 | Tinggi |

---

## 🛠️ Bagian 3: Rancangan Komponen Kriptografi

### 1. Hash Password (bcrypt)
- **Masukan**: String password plaintext dari form registrasi/login
- **Proses**: `bcrypt.hash(password, saltRounds=12)` membangkitkan salt acak 128-bit, lalu menjalankan Blowfish sebanyak 4.096 iterasi.
- **Keluaran**: String hash 60 karakter (`$2b$12$...`)
- **Sumber keacakan**: `crypto.randomBytes()` bawaan Node.js via bcrypt
- **Representasi data**: Base64-encoded string

### 2. Enkripsi Data Pribadi (AES-256-GCM)
- **Masukan**: String plaintext data pribadi + encryption key dari environment variable
- **Proses**: Pembangkitan IV 96-bit secara acak → enkripsi AES-256-GCM → menghasilkan ciphertext & authentication tag 128-bit.
- **Keluaran**: String hex terformat `iv:authTag:ciphertext`
- **Sumber keacakan**: `crypto.randomBytes(12)`
- **Representasi data**: Hexadecimal string

### 3. Verifikasi Integritas Pesanan (HMAC-SHA256)
- **Masukan**: Objek payload JSON pesanan + secret key
- **Proses**: Menghitung `createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex')`
- **Keluaran**: String heksadesimal 64 karakter (tanda tangan digital)
- **Sumber keacakan**: Fungsi deterministik
- **Representasi data**: Hexadecimal string

---

## 🚀 Petunjuk Menjalankan Proyek

### Prasyarat
- Node.js 18+
- npm

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Pengaturan Environment Variable
Salin file template `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Pastikan kunci rahasia sintetis/lokal telah terisi di `.env.local`:
```env
ENCRYPTION_KEY=kunci-test-32-karakter-sintetis!
HMAC_SECRET=hmac-secret-sintetis-untuk-testing
```

### 3. Menjalankan Aplikasi Web (Development)
```bash
npm run dev
```
Akses aplikasi melalui peramban di: `http://localhost:3000`

### 4. Menjalankan Uji Otomatis
```bash
npm test
```

---

## 🛡️ Bagian 4: Arsitektur Keamanan & Pemodelan Ancaman (Penanda `sec-0.1`)

Dokumentasi analisis keamanan komprehensif produk ADuri disajikan dalam dokumen-dokumen terpisah berikut:
1. **[Inventaris Aset Produk (`asset-inventory.md`)](asset-inventory.md)**: Klasifikasi tingkat sensitivitas Confidentiality, Integrity, dan Availability (CIA) untuk seluruh aset data, kredensial, perangkat lunak, dan layanan eksternal.
2. **[Diagram Aliran Data & Trust Boundary (`dfd.md`)](dfd.md)**: Pemodelan DFD Level 1 dengan ID elemen lengkap (E1–E4, P1–P5, DS1–DS5, DF01–DF16), 3 batas kepercayaan (*Trust Boundaries*), dan penandaan aset terproteksi kriptografi.
3. **[Model Ancaman STRIDE (`threat-model.md`)](threat-model.md)**: 12 skenario ancaman spesifik non-generik berbasis alur transaksi durian dan booking kunjungan kebun.
4. **[Daftar Risiko & Rencana Kontrol (`risk-register.md`)](risk-register.md)**: Matriks kemungkinan–dampak, penetapan 5 risiko prioritas utama, dan rencana kontrol teknis yang dipetakan ke **Tugas 2** dan **Tugas 3**.
5. **[Catatan Penggunaan AI (`AI_LOG.md`)](AI_LOG.md)**: Dokumentasi transparan penggunaan AI generatif dalam perancangan produk.

---

## 🎯 Bagian 5: Milestone v0.2 — Tugas 2 (Kriptografi Terintegrasi)

Pada Milestone `v0.2` (Pekan 6), ADuri menerapkan perlindungan kerahasiaan dan integritas data produk/katalog menggunakan **Authenticated Encryption with Associated Data (AEAD: AES-256-GCM)**, pemisahan domain kunci **HKDF-SHA256 (RFC 5869)**, validasi masukan *allowlist*, dan penanganan kegagalan *fail-closed*.

### 1. Parameter Kriptografi Resmi (Terdokumentasi)
- **Panjang Kunci:** 256-bit (32 byte), dibangkitkan via CSPRNG (`crypto.randomBytes(32)`).
- **Nonce / IV:** 96-bit (12 byte) unik dibangkitkan per operasi enkripsi (`crypto.randomBytes(12)`).
- **AAD (Additional Authenticated Data):** Mengikat `id_produk` durian (misal: `DRN-MKG-001`) ke ciphertext tanpa dienkripsi.
- **Authentication Tag:** 128-bit (16 byte) dari GMAC untuk verifikasi keaslian dan keutuhan data.
- **Penyimpanan Kunci:** Disimpan di luar repositori (`.env.local` yang masuk `.gitignore`).

### 2. Sambungan Antar-Komponen (T1 $\to$ T2)
Sesuai arahan evaluasi, komponen T2 tidak berdiri sendiri melainkan terintegrasi dengan komponen T1:
- **Kanonisasi Deterministik (T1 $\to$ T2):** Plaintext data produk divalidasi dan diurutkan secara kanonis menggunakan `kanonisasiJson()` (T1) sebelum dienkripsi dengan `enkripsiProdukAead()` (T2).
- **Pemisahan Kunci (HKDF-SHA256):** Master Key diturunkan menjadi sub-kunci AEAD dan HMAC independen.

### 3. Perintah Uji dari Klon Bersih (*Clean Clone*)
Untuk memeriksa dan menjalankan seluruh pengujian dari klon bersih:
```bash
git clone <url-repository> uji && cd uji
git checkout v0.2
npm install
npm test
```
Atau untuk menguji modul kriptografi saja:
```bash
npx vitest run __tests__/crypto.test.ts
```

### 4. Dokumen Kelengkapan Tugas 2
- **[`KEPUTUSAN.md`](KEPUTUSAN.md)**: Analisis kebutuhan $\to$ mekanisme $\to$ alasan & alternatif, parameter resmi, analisis bahaya *nonce reuse*, dan prinsip *fail-closed*.
- **[`EVALUASI.md`](EVALUASI.md)**: Rincian 19 skenario uji (positif, negatif, batas), temuan keamanan, perbaikan, dan evaluasi keterbatasan menuju Tugas 3.
- **[`AI_LOG.md`](AI_LOG.md)**: Catatan transparansi penggunaan AI generatif dengan format baku rubrik R2.