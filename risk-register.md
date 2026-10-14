# Daftar Risiko & Rencana Kontrol (Risk Register) — ADuri 🌿

Dokumen ini menyajikan penilaian risiko kualitatif–kuantitatif terhadap 12 ancaman yang diidentifikasi pada `threat-model.md`, menetapkan **lima risiko prioritas utama**, serta menyusun **rencana kontrol mitigasi** yang dipetakan ke **Tugas 2** dan **Tugas 3**.

---

## 1. Metodologi Penilaian Risiko

Tingkat risiko dihitung berdasarkan formula standar manajemen risiko perangkat lunak:
$$\text{Skor Risiko} = \text{Kemungkinan (Likelihood)} \times \text{Dampak (Impact)}$$

### A. Skala Kemungkinan (Likelihood: 1 – 5)
1. **Sangat Rendah (1)**: Membutuhkan hak akses internal istimewa dan keahlian teknis sangat tinggi.
2. **Rendah (2)**: Memerlukan kondisi prasyarat tertentu yang jarang terjadi di lingkungan produksi.
3. **Sedang (3)**: Dapat dieksploitasi oleh penyerang dengan alat standar jika tidak ada proteksi tambahan.
4. **Tinggi (4)**: Celah terekspos langsung di antarmuka publik tanpa proteksi server yang memadai saat ini.
5. **Sangat Tinggi (5)**: Sangat mudah dieksploitasi bahkan oleh pengguna awam tanpa keahlian teknis khusus.

### B. Skala Dampak (Impact: 1 – 5)
1. **Sangat Rendah (1)**: Gangguan visual minor tanpa kebocoran data atau kerugian material.
2. **Rendah (2)**: Ketidaknyamanan operasional skala kecil yang dapat dipulihkan dengan cepat.
3. **Sedang (3)**: Kerugian operasional sedang, perselisihan dengan pelanggan, atau data non-kritis terekspos.
4. **Tinggi (4)**: Kebocoran data pribadi (PII), gangguan ketersediaan toko online, atau kerugian finansial bisnis.
5. **Kritis (5)**: Runtuhnya seluruh integritas sistem kriptografi, pencurian massal data rahasia, atau kerugian finansial masif.

### C. Matriks Tingkat Risiko
- **1 – 5**: Risiko Rendah (*Low*) — Dapat diterima dengan pemantauan standar.
- **6 – 11**: Risiko Sedang (*Medium*) — Memerlukan kontrol mitigasi terjadwal.
- **12 – 16**: Risiko Tinggi (*High*) — Membutuhkan tindakan mitigasi prioritas.
- **17 – 25**: Risiko Kritis (*Critical*) — Wajib segera dimitigasi sebelum rilis publik.

---

## 2. Tabel Evaluasi Risiko Keseluruhan (12 Ancaman)

| ID Risiko | Ancaman Terkait | Elemen DFD | Aset | Kemungkinan (1-5) & Alasan Berdasarkan Produk | Dampak (1-5) & Alasan Berdasarkan Produk | Skor | Tingkat Risiko |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **RSK-01** | **THR-03**: Manipulasi Total Harga Pesanan di Klien | `DF05`, `P2` | `AST-05` | **4** (Tinggi) — Nilai `totalPrice` saat ini dihitung murni di JavaScript browser (`app/pembayaran/page.tsx`), sehingga sangat mudah dimodifikasi via DevTools atau intercept HTTP request. | **5** (Kritis) — Kerugian finansial langsung bagi kebun keluarga Asynur; durian premium (Duri Hitam Rp180rb/kg) bisa terorder dengan harga Rp1.800 jika server mempercayai nilai dari client. | **20** | **Kritis** 🔥 (Prioritas 1) |
| **RSK-02** | **THR-08**: Eksfiltrasi Data PII Pelanggan via SQL Injection | `DF08`, `DS3` | `AST-03`, `AST-04` | **4** (Tinggi) — Persiapan migrasi dari mock data ke database relasional pada Milestone 2 rentan terhadap celah SQLi jika pengembang menggunakan konkatenasi string SQL mentah. | **5** (Kritis) — Pelanggaran UU Perlindungan Data Pribadi; ribuan alamat rumah dan nomor WhatsApp pelanggan durian di Riau terekspos ke publik, merusak reputasi keluarga. | **20** | **Kritis** 🔥 (Prioritas 2) |
| **RSK-03** | **THR-05**: Penyangkalan Bukti Pembayaran Deposit Booking | `DF12`, `E1` | `AST-06`, `AST-07` | **4** (Tinggi) — Pembayaran deposit Rp50.000 dilakukan manual via transfer rekening BCA atau QRIS tanpa integrasi mutasi API otomatis; struk transfer palsu sangat marak beredar. | **4** (Tinggi) — Terjadi perselisihan di lokasi kebun antara keluarga pemilik dan calon pengunjung; kerugian operasional memanen buah matang pohon yang akhirnya tidak diambil. | **16** | **Tinggi** ⚠️ (Prioritas 3) |
| **RSK-04** | **THR-07**: Kebocoran Master Key Kriptografi `.env.local` | `DS5`, `DF07` | `AST-02` | **3** (Sedang) — File `.env.local` telah diabaikan di `.gitignore`, namun risiko ketidaksengajaan terunggah saat deployment manual atau miskonfigurasi server tetap ada. | **5** (Kritis) — Seluruh enkripsi AES-256-GCM pada data kontak dan integritas tanda tangan HMAC runtuh seketika (*Total Cryptographic Compromise*). | **15** | **Tinggi** ⚠️ (Prioritas 4) |
| **RSK-05** | **THR-09**: Serangan DoS Melalui Flooding Bcrypt Hashing | `P5`, `AST-12` | `AST-12`, `AST-01` | **3** (Sedang) — Parameter `SALT_ROUNDS = 12` membutuhkan komputasi CPU intensif (~500ms per hash); script flooding sederhana dapat membebani threadpool Node.js. | **4** (Tinggi) — Server Next.js menjadi *unresponsive* / timeout (100% CPU usage), melumpuhkan toko online sehingga pengunjung lain tidak dapat berbelanja durian. | **12** | **Tinggi** ⚠️ (Prioritas 5) |
| **RSK-06** | **THR-01**: Spoofing Booking Kunjungan Kebun | `DF11`, `P4` | `AST-06`, `AST-03` | **4** (Tinggi) — Form di `/ambil-sendiri` dapat diisi nomor HP acak tanpa proses verifikasi OTP / SMS. | **3** (Sedang) — Jadwal operasional kebun terganggu dan mencatut nomor orang lain, namun belum ada durian fisik yang keluar. | **12** | Tinggi |
| **RSK-07** | **THR-02**: Brute-Force Kredensial Login | `DF15`, `P5` | `AST-01`, `DS2` | **3** (Sedang) — Target toko durian lokal spesifik, tetapi otomatisasi skrip bot pencoba password dapat menyerang form login. | **4** (Tinggi) — Pengambilalihan akun pelanggan sah yang memungkinkan akses riwayat pengiriman dan data pribadi. | **12** | Tinggi |
| **RSK-08** | **THR-10**: Flooding Habiskan Kuota Harian Kebun | `P4`, `DS4` | `AST-06`, `AST-12` | **3** (Sedang) — Belum ada proteksi bot/CAPTCHA pada pemilihan tanggal dan jam kedatangan kebun. | **3** (Sedang) — Kuota rombongan harian tampak penuh semu, namun admin dapat mereset data secara manual. | **9** | Sedang |
| **RSK-09** | **THR-11**: Akses IDOR pada Nota Pesanan | `DS3`, `P2` | `AST-03`, `AST-04` | **3** (Sedang) — Jika query pesanan hanya mengandalkan ID numerik `?id=123` tanpa verifikasi session user. | **3** (Sedang) — Pelanggan dapat melihat daftar durian dan alamat pembeli lain, tetapi tidak dapat mengubah data. | **9** | Sedang |
| **RSK-10** | **THR-04**: Injeksi Parameter Tautan WhatsApp | `DF14`, `P4` | `AST-06`, `AST-10` | **3** (Sedang) — Catatan pesanan di-encode ke URI string; penyerang perlu memanipulasi teks pesan konfirmasi. | **3** (Sedang) — Pemilik kebun berpotensi bingung membaca instruksi palsu, tetapi verifikasi rekening riil masih dipegang pemilik. | **9** | Sedang |
| **RSK-11** | **THR-12**: Mass Assignment Status Lunas | `DF05`, `P2` | `AST-05`, `AST-07` | **2** (Rendah) — Membutuhkan pengiriman payload custom raw HTTP JSON melampaui antarmuka UI web. | **4** (Tinggi) — Pesanan dapat tertandai "Lunas" di database internal tanpa dana riil masuk ke rekening kebun. | **8** | Sedang |
| **RSK-12** | **THR-06**: Penyangkalan Pemesanan Tanpa Jejak Audit | `DF08`, `DS3` | `AST-05` | **2** (Rendah) — Sebagian besar pembeli durian memesan dengan konfirmasi langsung lewat kontak personal WhatsApp. | **3** (Sedang) — Kerugian ongkos kirim dan satu paket durian jika pembeli menolak membayar saat kurir tiba. | **6** | Sedang |

---

## 3. Lima Risiko Prioritas Utama (Top 5 Priority Risks)

Berdasarkan skor risiko tertinggi dan dampaknya terhadap kelangsungan bisnis kebun keluarga Asynur, ditetapkan 5 risiko prioritas berikut:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TOP 5 RISIKO PRIORITAS ADURI                   │
│                                                                        │
│  [1] RSK-01 (Skor 20 - Kritis) : Manipulasi Total Harga di Klien       │
│  [2] RSK-02 (Skor 20 - Kritis) : Eksfiltrasi PII via SQL Injection    │
│  [3] RSK-03 (Skor 16 - Tinggi) : Penyangkalan Transfer Deposit Rp50rb │
│  [4] RSK-04 (Skor 15 - Tinggi) : Kebocoran Master Key Kriptografi      │
│  [5] RSK-05 (Skor 12 - Tinggi) : DoS CPU Exhaustion via Bcrypt Flooding│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Rencana Kontrol Mitigasi & Pemetaan Tugas (Tugas 2 vs Tugas 3)

| ID Risiko | Deskripsi Singkat Risiko | Rencana Kontrol Mitigasi (*Proposed Security Controls*) | Mekanisme Menurunkan Kemungkinan / Dampak | Pemetaan Kurikulum | Rationale & Penjelasan untuk Demonstrasi |
|:---:|:---|:---|:---|:---:|:---|
| **RSK-01** | Manipulasi Total Harga Pesanan di Klien | **1. Validasi Harga Server-Side Mutlak**:<br>Server tidak boleh mempercayai nilai harga atau total dari request client. Server mengambil harga satuan durian resmi dari database/catalog internal berdasarkan `slug`, lalu menghitung `total = price * quantity` di backend.<br>**2. Penandatanganan Integritas HMAC**:<br>Menerapkan fungsi `generateOrderHMAC(payload)` dan `verifyOrderHMAC()` dari `lib/crypto.ts` untuk memastikan payload tidak dimanipulasi saat proses checkout. | **Menurunkan Kemungkinan**: Penyerang tidak bisa lagi mengubah harga melalui manipulasi state browser karena kalkulasi dipaksa terjadi di backend.<br>**Menurunkan Dampak**: Kerugian finansial akibat transaksi harga palsu menjadi 0. | **Tugas 2**<br>*(Implementasi Backend & Logika Server)* | Pada demonstrasi Tugas 2, mahasiswa akan mendemonstrasikan upaya manipulasi harga di DevTools browser, dan membuktikan bahwa server Next.js Server Action otomatis menolak atau mengoreksi total bayar sesuai harga resmi katalog. |
| **RSK-02** | Eksfiltrasi Data PII via SQL Injection saat Integrasi DB | **1. Penggunaan Parameterized Query / ORM Berbasis Type-Safe**:<br>Menggunakan ORM seperti Prisma atau Drizzle, atau prepared statements murni (`$1, $2`). Tidak ada konkatenasi string SQL mentah.<br>**2. Enkripsi Data Sensitif At-Rest**:<br>Mengintegrasikan fungsi `encryptData()` (**AES-256-GCM**) pada kolom `phone_enc` dan `address_enc` sebelum disimpan ke database. | **Menurunkan Kemungkinan**: Parameterized query meniadakan celah eksekusi sintaks SQL liar.<br>**Menurunkan Dampak**: Sekalipun database mentah berhasil dibaca penyerang, data kontak dan alamat pelanggan tetap berupa ciphertext terenkripsi yang tidak dapat dibaca tanpa kunci master. | **Tugas 2**<br>*(Integrasi Database & Skema Penyimpanan Aman)* | Mahasiswa dapat menunjukkan kode skema database dan membuktikan saat melakukan `SELECT * FROM orders;`, nomor HP dan alamat yang muncul di database adalah string hex terenkripsi (`iv:authTag:ciphertext`). |
| **RSK-03** | Penyangkalan Bukti Pembayaran Deposit Booking Rp50rb | **1. Pencatatan Kode Unik Transaksi & Upload Bukti Pembayaran**:<br>Menghasilkan 3 digit kode unik pada deposit (contoh: Rp50.182) atau integrasi modul verifikasi pembayaran digital (QRIS dinamis).<br>**2. Logging Status Pembayaran Transaksional**:<br>Status booking diawali dengan `PENDING_DEPOSIT` dan hanya berubah ke `CONFIRMED` setelah diverifikasi melalui kode acuan mutasi bank. | **Menurunkan Kemungkinan**: Menghilangkan peluang pengunjung menggunakan bukti transfer editan karena setiap transaksi memiliki nominal unik atau referensi transaksi bank yang tercatat.<br>**Menurunkan Dampak**: Menghindari perselisihan di kebun dan menjamin kepastian operasional panen durian. | **Tugas 2**<br>*(Logika Alur Transaksi & Validasi Pembayaran)* | Mahasiswa menjelaskan mekanisme generator kode transfer unik pada saat checkout deposit booking dan pencatatan state `PENDING` hingga `CONFIRMED`. |
| **RSK-04** | Kebocoran Master Key Kriptografi `.env.local` | **1. Isolasi Environtment Variables & Secret Scanning**:<br>Menjaga `.env.local` tetap terisolasi di server; mengaktifkan GitHub Secret Scanning dan *pre-commit hook* untuk mencegah kunci terdorong ke remote repository.<br>**2. Pembatasan Lingkup Kunci**:<br>Memisahkan kunci enkripsi produksi dengan kunci testing/sintetis (`vitest.config.mts`). | **Menurunkan Kemungkinan**: Secret scanner otomatis memblokir commit yang memuat pola kunci rahasia berkekuatan 256-bit.<br>**Menurunkan Dampak**: Penggunaan data sintetis pada pengujian menjamin jika repo publik diakses dosen/publik, tidak ada data pelanggan asli yang terancam. | **Tugas 3**<br>*(Manajemen Konfigurasi Keamanan & Secret Vault)* | Mahasiswa menjelaskan strategi pertahanan berlapis pada file rahasia, audit repository git, dan pemisahan environment runtime produksi dengan testing lokal. |
| **RSK-05** | DoS Melalui Flooding Bcrypt Hashing | **1. Penerapan Rate Limiting & Request Throttling**:<br>Membatasi frekuensi request pada endpoint login/registrasi maksimal 5 percobaan per menit per alamat IP.<br>**2. Offloading & Worker Threads**:<br>Menjalankan proses hashing di luar main event-loop Node.js atau menerapkan CAPTCHA interaktif (misal Cloudflare Turnstile) sebelum fungsi `hashPassword()` dipanggil. | **Menurunkan Kemungkinan**: Penyerang otomatis diblokir (HTTP 429 Too Many Requests) setelah beberapa kali mencoba membanjiri server.<br>**Menurunkan Dampak**: CPU server tidak mengalami saturasi 100%, sehingga pengguna lain tetap dapat mengakses website durian tanpa lag. | **Tugas 3**<br>*(Proteksi Ketersediaan, Rate Limiting & Hardening Server)* | Mahasiswa menjelaskan bagaimana middleware rate limiting pada Next.js membatasi komputasi intensif fungsi bcrypt untuk menjaga ketersediaan layanan (*Availability*). |

---

## 5. Ringkasan Eksekutif untuk Penilaian Demonstrasi (Pekan 3)
Saat mempresentasikan dokumen ini di hadapan penguji/dosen:
1. **Konteks Produk Nyata**: Seluruh ancaman dan risiko di atas tidak mengada-ada (*non-generik*), melainkan berangkat dari alur nyata web ADuri: pemesanan buah durian segar antar kota di Riau dan reservasi kunjungan langsung ke kebun keluarga di Kampar.
2. **Keterkaitan Kriptografi**: Komponen kriptografi dasar yang telah dibuat pada `lib/crypto.ts` (bcrypt, AES-256-GCM, HMAC-SHA256) diposisikan sebagai pilar kontrol mitigasi teknis utama untuk risiko RSK-01, RSK-02, dan RSK-04.
3. **Peta Jalan Bertahap**: Tugas 2 difokuskan pada penegakan integritas data sisi server (*server-side business logic*) dan enkripsi penyimpanan database, sedangkan Tugas 3 melengkapinya dengan perlindungan infrastruktur, manajemen secret, dan *rate limiting*.
