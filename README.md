# ADuri
## Deskripsi Produk

**ADuri** adalah platform e-commerce berbasis web yang memfasilitasi penjualan buah durian hasil kebun keluarga. Layanan pengiriman saat ini difokuskan di wilayah **Riau** untuk menjaga kesegaran dan kualitas buah dari kebun langsung ke tangan pembeli.

Pengguna yang belum login dapat menjelajahi katalog produk yang tersedia.Namun untuk melakukan transaksi pembelian, pengguna diwajibkan untuk mendaftar atau masuk ke dalam akun. Pembayaran tersedia melalui **transfer bank (TF)**
dan **kode QR**.

Aplikasi ini mengimplementasikan komponen kriptografi untuk menjaga kerahasiaan dan integritas data pengguna serta data transaksi.

## Kebutuhan Kriptografi

| No | Data yang Dilindungi | Tujuan Keamanan | Teknik Kriptografi | Prioritas |
|----|----------------------|-----------------|-------------------|-----------|
| 1 | Password akun pengguna | **Confidentiality** — password tidak boleh terbaca meski database bocor | Hashing (bcrypt, salt otomatis, cost factor 12) | Tinggi |
| 2 | Nomor rekening & nomor telepon pembeli | **Confidentiality** — data finansial dan kontak pribadi harus terlindungi | Enkripsi simetrik (AES-256-GCM) | Tinggi |
| 3 | Alamat pengiriman pembeli | **Confidentiality** — informasi lokasi fisik pembeli wajib dilindungi | Enkripsi simetrik (AES-256-GCM) | Tinggi |
| 4 | Integritas payload pesanan (item, harga, total) | **Integrity** — data pesanan tidak boleh dimanipulasi saat checkout | HMAC-SHA256 | Tinggi |

## Rancangan Komponen Kriptografi

### 1. Hash Password (bcrypt)

| Aspek | Detail |
|-------|--------|
| **Masukan** | String password plaintext dari form registrasi/login |
| **Proses** | `bcrypt.hash(password, saltRounds=12)` — bcrypt membangkitkan salt acak 128-bit, lalu menjalankan algoritma Blowfish sebanyak 2¹² = 4.096 iterasi |
| **Keluaran** | String hash 60 karakter (contoh: `$2b$12$abc...xyz`) |
| **Sumber keacakan** | `crypto.randomBytes()` bawaan Node.js, dipanggil secara internal oleh bcrypt |
| **Representasi data** | Base64-encoded string, disimpan di kolom `password_hash` tabel `users` |

### 2. Enkripsi Data Pribadi (AES-256-GCM)

| Aspek | Detail |
|-------|--------|
| **Masukan** | String plaintext (nomor rekening / nomor HP / alamat) + encryption key dari environment variable |
| **Proses** | `crypto.randomBytes(12)` → IV acak 96-bit → `AES-256-GCM(key, iv, plaintext)` → menghasilkan ciphertext + authentication tag 128-bit |
| **Keluaran** | String format `iv:authTag:ciphertext` (hex-encoded) |
| **Sumber keacakan** | `crypto.randomBytes(12)` untuk IV — setiap pemanggilan menghasilkan IV yang berbeda |
| **Representasi data** | Hexadecimal string, disimpan di kolom `phone_enc`, `address_enc`, `bank_account_enc` |

### 3. Verifikasi Integritas Pesanan (HMAC-SHA256)

| Aspek | Detail |
|-------|--------|
| **Masukan** | JSON payload pesanan (daftar item, harga satuan, total, userId) + secret key |
| **Proses** | `createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex')` |
| **Keluaran** | Hex string 64 karakter (signature/tanda tangan digital) |
| **Sumber keacakan** | Tidak memerlukan keacakan (fungsi deterministik) |
| **Representasi data** | Hexadecimal string, disimpan di kolom `order_signature` tabel `orders` |

## Cara Menjalankan

### Prasyarat
- Node.js 18 atau lebih baru
- npm

### Instalasi dependensi

```bash
npm install
```

### Menyiapkan environment variable

Buat file `.env.local` di root proyek:

```
ENCRYPTION_KEY=isi-dengan-32-karakter-kunci-acak
HMAC_SECRET=isi-dengan-secret-panjang-untuk-hmac
```

### Menjalankan aplikasi (development)

```bash
npm run dev
```

### Menjalankan uji otomatis

```bash
npm test
```