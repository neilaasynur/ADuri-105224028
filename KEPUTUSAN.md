# KEPUTUSAN.md — Desain Kriptografi & Manajemen Keamanan (Milestone v0.2)

Dokumen ini mendokumentasikan keputusan arsitektur kriptografi pada proyek **ADuri — Website Penjualan Durian Keluarga Asynur** untuk memenuhi kriteria evaluasi **Tugas 2 (Milestone v0.2 — Pekan 6)** sesuai Rubrik R2.

---

## 1. Matriks Keputusan: Kebutuhan $\to$ Mekanisme $\to$ Alasan & Alternatif

| No | Kebutuhan Perlindungan Aset | Mekanisme yang Dipilih | Alasan & Justifikasi Teknis | Alternatif yang Ditolak & Alasannya |
|:--:|:---|:---|:---|:---|
| 1 | **Kerahasiaan & Integritas Data Produk/Katalog**<br>*(Aset `AST-05`: Kuota panen rahasia, harga grosir, stok gudang internal)* | **AEAD: AES-256-GCM**<br>*(NIST SP 800-38D)* dengan AAD berupa `id_produk`. | Menyediakan **kerahasiaan** (*confidentiality*) sekaligus **keaslian/integritas** (*integrity & authenticity*) dalam satu operasi terpadu dengan performa tinggi (akselerasi perangkat keras AES-NI). AAD mengikat rekaman terenkripsi ke identitas varietas durian secara permanen. | **Ditolak:**<br>1. *AES-CBC + HMAC-SHA256 terpisah*: Rawan kesalahan komposisi (*cryptographic doom principle*) dan celah *padding oracle*.<br>2. *AES-ECB*: Membocorkan pola data plaintext.<br>3. *Base64 / Hashing murni*: Encoding bukan pengaman; hash tanpa kunci tidak melindungi dari manipulasi penyerang aktif. |
| 2 | **Pencegahan Relokasi / Pemalsuan Konteks Data**<br>*(Mencegah paket ciphertext durian murah ditukar untuk durian premium)* | **Additional Authenticated Data (AAD)** pada AES-GCM. | AAD ikut diotentikasi oleh fungsi polinomial GMAC tanpa perlu dienkripsi. Jika penyerang menyalin ciphertext dari durian lokal murah ke slot durian Musang King premium, verifikasi GMAC otomatis gagal (*fail-closed*). | **Ditolak:**<br>*Menyematkan ID di dalam plaintext*: Membutuhkan dekripsi penuh terlebih dahulu baru diketahui pemalsuannya; AAD memverifikasi otentisitas sebelum data didekripsi. |
| 3 | **Pemisahan Domain Kunci (*Key Separation*)**<br>*(Mencegah satu kunci dipakai untuk dua fungsi kriptografi berbeda)* | **HKDF-SHA256**<br>*(RFC 5869)* dengan label domain spesifik. | Menurunkan sub-kunci independen dari satu *Master Key* di `.env.local`: Sub-kunci AEAD (`aduri v0.2 aead_produk`) dan Sub-kunci HMAC (`aduri v0.2 hmac_pesanan`). Mencegah serangan *cross-protocol interaction*. | **Ditolak:**<br>*Single Master Key Reuse*: Menggunakan satu kunci langsung untuk AES-GCM dan HMAC sangat berbahaya secara matematis karena kelemahan pada satu primitif dapat membocorkan kunci primitif lain. |
| 4 | **Integritas Payload Transaksi Checkout**<br>*(Aset `AST-06`: Nilai total pesanan durian)* | **HMAC-SHA256** dengan kanonisasi JSON deterministik & `timingSafeEqual`. | Menjamin bahwa nilai pesanan yang dihitung di backend tidak dapat dimanipulasi saat melintasi antarmuka klien. Perbandingan konstan mencegah *timing attack*. | **Ditolak:**<br>*SHA-256 biasa (tanpa kunci)*: Penyerang yang mengubah harga dapat menghitung ulang hash SHA-256 dengan mudah. |
| 5 | **Perlindungan Kredensial Pengelola Kebun**<br>*(Aset `AST-01`: Kata sandi akun)* | **Bcrypt** ($2^{12} = 4.096$ iterasi) dengan salt CSPRNG 128-bit. | Fungsi hash *memory-hard* dan *work-factor adjustable* yang dirancang tahan terhadap serangan akselerasi GPU/ASIC brute-force. | **Ditolak:**<br>*MD5 / SHA-256*: Terlalu cepat dihitung (miliaran hash/detik di GPU), rentan terhadap *rainbow table*. |

---

## 2. Dokumentasi Parameter Kriptografi Resmi

Sesuai standar **NIST SP 800-38D** dan dokumentasi pustaka bawaan `crypto` Node.js:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       STRUKTUR PAKET AEAD AES-256-GCM                       │
│                                                                             │
│  [ Nonce / IV ]  : 12 byte (96-bit)   --> Acak unik per enkripsi (CSPRNG)   │
│  [ Auth Tag ]    : 16 byte (128-bit)  --> Dihasilkan oleh fungsi GMAC       │
│  [ Ciphertext ]  : Variabel (N byte)  --> Enkripsi Counter (CTR mode)       │
│  [ AAD ]         : id_produk string   --> Diotentikasi, tidak dienkripsi    │
│                                                                             │
│  Format Serialisasi:  "${iv_hex}:${authTag_hex}:${ciphertext_hex}"          │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Panjang Kunci (Key Length):**
   * **Ukuran:** Tepat 32 byte (256-bit).
   * **Pembangkitan:** Menggunakan CSPRNG (`crypto.randomBytes(32)`).
   * **Penyimpanan:** Disimpan di luar repositori git pada file `.env.local` (variabel `ENCRYPTION_KEY`). File diabaikan secara ketat oleh `.gitignore`.
2. **Nonce / Initial Vector (IV):**
   * **Ukuran:** 12 byte (96-bit).
   * **Pembangkitan:** Dibangkitkan segar (*fresh random*) setiap kali fungsi `enkripsiProdukAead()` dieksekusi via `randomBytes(12)`.
   * **Rasional NIST:** Ukuran 96-bit adalah rekomendasi NIST karena langsung digunakan sebagai counter awal tanpa memerlukan operasi hashing GHASH tambahan.
3. **Additional Authenticated Data (AAD):**
   * **Konten:** Identifier unik produk durian (`id_produk`, contoh: `DRN-MKG-001`).
   * **Fungsi:** Mengikat ciphertext ke produk spesifik sehingga data terenkripsi tidak dapat dipindahkan ke produk lain.
4. **Authentication Tag (Tag):**
   * **Ukuran:** 16 byte (128-bit).
   * **Mekanisme:** Dihasilkan oleh GHASH/GMAC pada akhir proses enkripsi. Verifikasi tag bersifat mutlak sebelum plaintext diserahkan ke aplikasi.

---

## 3. Analisis Kritis: Akibat Fatal Bila Nonce Berulang (*Nonce Reuse*)

Pada mode operasi **AES-GCM**, pengulangan nonce (*nonce reuse*) dengan kunci yang sama adalah **bencana fatal bagi keamanan sistem (*Catastrophic Failure*)**:

1. **Runtuhnya Kerahasiaan (Two-Time Pad Attack):**
   * AES-GCM mengenkripsi data menggunakan mode Counter (CTR), di mana stream keystream $S$ dihasilkan dari enkripsi blok counter:
     $$C_1 = P_1 \oplus S, \quad C_2 = P_2 \oplus S$$
   * Jika Nonce diulang, maka $S$ identik. Penyerang yang menyadap $C_1$ dan $C_2$ dapat melakukan operasi XOR langsung:
     $$C_1 \oplus C_2 = (P_1 \oplus S) \oplus (P_2 \oplus S) = P_1 \oplus P_2$$
   * Keystream tereliminasi sepenuhnya, mengekspos relasi langsung antara kedua plaintext yang dapat dipecahkan dengan analisis frekuensi linguistik.
2. **Pemulihan Kunci Otentikasi GMAC ($H$) & Pemalsuan Universal (*Universal Forgery*):**
   * Pada GCM, otentikasi dihitung menggunakan polinomial atas Galois Field $\text{GF}(2^{128})$ yang dievaluasi dengan *hash subkey* $H = E_K(0^{128})$.
   * Jika dua pesan berbeda menggunakan Nonce yang sama, selisih tag autentikasi ($\Delta T = T_1 \oplus T_2$) memungkinkan penyerang menyelesaikan persamaan polinomial untuk **menemukan nilai rahasia $H$** (serangan *Joux's Forgery Attack*).
   * Setelah $H$ diketahui penyerang, penyerang dapat **membuat tag otentikasi yang sah untuk ciphertext palsu apa pun** tanpa perlu mengetahui kunci enkripsi utama $K$.
3. **Mitigasi di ADuri:**
   * Nonce dibangkitkan secara acak dari CSPRNG berkekuatan tinggi (`crypto.randomBytes(12)`). Dengan ruang kemungkinan $2^{96} \approx 7.9 \times 10^{28}$, probabilitas tabrakan nonce (*birthday collision*) dapat diabaikan untuk siklus hidup kunci operasional.

---

## 4. Validasi Masukan & Prinsip Gagal Tertutup (*Fail-Closed*)

Sistem menerapkan validasi masukan pada lapisan batas (*boundary validation*) sebelum data menyentuh modul kriptografi:
1. **Validasi Allowlist Ketat (`validasiCatatanProduk`):**
   * Hanya field yang terdaftar (`id_produk`, `nama`, `kategori`, `harga`, `stok_rahasia`, `waktu_panen`) yang diterima.
   * Field tak dikenal atau properti injeksi ditolak seketika (`MasukanTidakValid`).
   * Tipe data diperiksa ketat: `harga` harus bilangan riil finite $\ge 0$ (menolak `NaN`, `Infinity`, negatif), `stok_rahasia` harus integer $\ge 0$.
2. **Prinsip Gagal Tertutup (*Fail-Closed*):**
   * Modul dekripsi tidak pernah menelan galat (*swallow error*) atau mengembalikan nilai `null`/`""`.
   * Jika ada modifikasi 1 bit pada ciphertext, tag tidak valid, AAD tidak cocok, atau kunci salah, fungsi langsung melempar exception `AutentikasiGagal` dan memutus aliran proses.
   * Pesan galat dirancang higienis: **tidak pernah memuat plaintext, ciphertext parsial, atau material kunci rahasia**.

---

## 5. Matriks Sambungan T1 $\to$ T2 (Arti Terhubung)

Sesuai arahan Slide Pekan 6, komponen T2 diintegrasikan secara organik dengan memanggil komponen T1:

| Komponen T1 (v0.1) | Komponen T2 (v0.2) | Titik Sambungan (*Integration Line*) | Bukti Uji yang Melintasi Sambungan |
|---|---|---|---|
| `kanonisasiJson()`<br>*(Kanonisasi deterministik RFC 8785)* | `enkripsiProdukAead()`<br>*(AEAD AES-256-GCM)* | `lib/crypto.ts`:<br>Plaintext dinormalkan dan diurutkan propertinya via `kanonisasiJson()` sebelum masuk ke `cipher.update()`. | Uji `Kelompok 5: Uji Sambungan Antar-Komponen`<br>Menjamin objek dengan urutan properti acak menghasilkan byte kanonis identik dan dapat didekripsi sempurna. |
| `kanonisasiJson()` | `generateOrderHMAC()`<br>*(Tanda tangan integritas)* | `lib/crypto.ts`:<br>Payload pesanan diurutkan secara kanonis sebelum diumpankan ke `createHmac()`. | Uji `Kelompok 2 & 5`<br>Perubahan urutan properti tidak merusak tanda tangan jika isinya setara secara semantik. |
| Master Key / Password | `turunkanKunci()`<br>*(HKDF-SHA256)* | `lib/crypto.ts`:<br>Kunci master dari T1 dialirkan ke HKDF untuk menurunkan sub-kunci spesifik AEAD dan HMAC. | Uji `Kelompok 4: [KEY SEPARATION]`<br>Membuktikan sub-kunci AEAD dan HMAC terpisah secara matematis. |

---

*Disusun oleh: Neila Faaizah Asynur — 105224028*  
*Repositori: ADuri-105224028 (Tag v0.2)*
