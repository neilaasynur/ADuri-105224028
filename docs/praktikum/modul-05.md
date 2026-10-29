# Dokumen Teknis Modul 5 — Formulir, Validasi, Session, dan Cookie

**Nama / NIM** : Neila Faaizah Asynur / 105224028 
**Repositori** : [https://github.com/neilaasynur/ADuri-105224028/tree/praktikum/modul-05](https://github.com/neilaasynur/ADuri-105224028/tree/praktikum/modul-05) 

## 1. Skema Validasi

### Tabel Kolom Formulir Penambahan Varietas Durian (`skemaItem` / `skemaDurian`)

| Nama Kolom | Tipe Input | Aturan Zod 4 | Pesan Galat | Alasan Aturan Bisnis |
| :--- | :--- | :--- | :--- | :--- |
| `judul` | Text | `z.string().trim().min(3).max(80)` | "Judul/nama varietas durian minimal 3 karakter" / "Judul/nama varietas durian maksimal 80 karakter" | Menampung nama varietas durian panen (mis. "Durian Tembaga Kampar Super") tanpa spasi kosong liar. |
| `kategori` | Select | `z.enum(["lokal", "unggulan", "premium"])` | "Pilih salah satu kategori varietas!" | Mengelompokkan kelas mutu durian untuk mempermudah filter katalog dan penentuan harga pasar. |
| `harga` | Number | `z.coerce.number().min(10000).max(1000000).default(45000)` | "Harga per kilogram minimal Rp10.000" / "Harga per kilogram maksimal Rp1.000.000" | Batas wajar harga jual durian per kg guna mencegah kesalahan input angka negatif atau harga yang terlalu ekstrem. |
| `deskripsi` | Textarea | `z.string().trim().min(10).max(300)` | "Deskripsi rasa harus diisi minimal 10 karakter" / "Deskripsi rasa & panen maksimal 300 karakter" | Memastikan staf kebun memberikan rincian aroma, tekstur daging, dan karakter rasa kepada calon pembeli. |
| `tersedia` | Checkbox | `z.stringbool().default(false)` | *(Otomatis dikonversi ke boolean)* | Status ketersediaan buah di kebun (apakah varietas sedang masa panen aktif atau belum). |

### Tabel Kolom Formulir Pembayaran & Reservasi Kunjungan

| Nama Kolom | Tipe Input | Aturan Zod 4 / Regex | Pesan Galat | Alasan Aturan Bisnis |
| :--- | :--- | :--- | :--- | :--- |
| `fullName` | Text | `z.string().trim().min(3).max(80).regex(/^[a-zA-Z\s'.]+$/)` | "Nama lengkap harus diisi dengan huruf abjad(tidak boleh mengandung angka atau simbol)" | Memastikan nama pembeli tidak diinputkan secara acak. |
| `phone` | Tel | `z.string().trim().regex(/^08[0-9]{8,12}$/)` | "Nomor telepon harus berupa angka, diawali '08', dan terdiri dari 10-14 digit" | Memastikan kurir kebun dan staf administrasi dapat menghubungi WhatsApp pelanggan aktif Indonesia. |
| `district` | Select | `z.string().min(1)` | "Wilayah kabupaten/kota pengiriman wajib dipilih" | Memastikan ongkir dan estimasi rute kurir buah durian beku/segar dapat dihitung akurat. |
| `address` | Textarea | `z.string().trim().min(10).max(300)` | "Alamat lengkap pengiriman minimal 10 karakter..." | Mencegah alamat tidak lengkap yang berisiko durian basi di perjalanan akibat salah alamat. |
| `quantity` | Number | `z.number().int().min(1).max(20)` | "Jumlah pesanan minimal 1 buah/kg" / "...maksimal 20..." | Membatasi kuota maksimal satu transaksi agar adil bagi pembeli lain saat panen raya. |
| `paymentMethod` | Radio | `z.enum(["qris", "transfer"])` | "Pilih salah satu metode pembayaran yang sah..." | Rekonsiliasi pembayaran instan kebun ADuri via QRIS Dinamis atau Transfer Bank . |

### Aturan Semantik yang Diperiksa di Server Action dan Alasannya

Validasi bentuk (sintaksis) melalui Zod hanya memeriksa apakah format string, angka, dan batas karakter telah terpenuhi. Namun, dalam sistem perkebunan nyata, diperlukan **Validasi Semantik Bisnis** yang memeriksa arti logis data terhadap kondisi basis data / inventaris aktif kebun:

1. **Pencegahan Duplikasi Nama Varietas (`judulSudahAda`)**:
   - **Lokasi Pemeriksaan**: `app/produk/actions.ts` -> fungsi `judulSudahAda(hasil.data.judul)` pada `lib/data.ts`.
   - **Mekanisme**: Memeriksa apakah nama varietas atau slug yang dimasukkan sudah pernah ada di katalog aktif (`daftarItem.some(...)`).
   - **Alasan Bisnis**: Mencegah staf kebun mendaftarkan varietas yang sama dua kali secara tidak sengaja (misal mendaftarkan "Durian Montong" padahal sudah ada), yang dapat merusak tautan URL (`/produk/durian-montong`), membingungkan algoritma pencarian, dan memecah ulasan pelanggan.
2. **Kredensial Keamanan Akun Pengelola (`DEMO_EMAIL` & `DEMO_KATA_SANDI`)**:
   - **Lokasi Pemeriksaan**: `app/masuk/actions.ts`.
   - **Alasan Bisnis**: Memastikan hanya personil resmi kebun keluarga Asynur yang dapat mengakses formulir penambahan katalog panen, sedangkan pembeli umum hanya memiliki akses baca (*read-only*).


## 2. Alur Server Action

### Urutan 5 Tahap Server Action (`simpanItem`)

Server Action penambahan produk di `app/produk/actions.ts` dirancang dengan arsitektur ketat berurutan:

```
[1. Pemeriksaan Sesi Pengelola]
              │
              ▼ (Lolos)
[2. Validasi Bentuk (Zod 4 Syntax)]
              │
              ▼ (Lolos)
[3. Validasi Aturan Semantik Bisnis (Cek Duplikasi Nama)]
              │
              ▼ (Lolos)
[4. Mutasi Data (Penambahan ke Katalog Aktif)]
              │
              ▼ (Berhasil disimpan)
[5. Revalidasi Cache & Redirect (/produk & /produk/[slug])]
```

1. **Pemeriksaan Sesi**: Server Action memanggil `await bacaSesi()` dari `lib/sesi.ts`. Jika sesi tidak ditemukan atau kedaluwarsa, eksekusi langsung berhenti dan mengembalikan pesan galat.
2. **Validasi Bentuk**: Data mentah dari `FormData` divalidasi menggunakan `skemaItem.safeParse(mentah)`. Jika gagal, galat diekstrak menggunakan `z.flattenError(hasil.error).fieldErrors` dan dikembalikan ke komponen klien beserta nilai isian sebelumnya.
3. **Validasi Semantik**: Memeriksa apakah nama varietas telah terdaftar melalui `judulSudahAda(hasil.data.judul)`. Jika nama sudah ada, dikembalikan pesan galat spesifik pada kolom `judul`.
4. **Mutasi Data**: Memanggil `tambahItem(hasil.data)` di `lib/data.ts` untuk membuat entri produk baru dengan ID unik, slug otomatis, perhitungan harga terformat, dan atribut panen lengkap.
5. **Revalidasi & Pengalihan Halaman**:
   - Memanggil `revalidatePath("/produk")` untuk memperbarui *cache* daftar katalog durian.
   - Memanggil `redirect("/produk/" + produkBaru.slug)` di **luar blok try-catch** (karena Next.js menggunakan *thrown error* internal `NEXT_REDIRECT` untuk pengalihan halaman).

### Pembagian Berkas

| Jenis Komponen | Berkas | Peran dan Tanggung Jawab |
| :--- | :--- | :--- |
| **Server Component** | `app/produk/tambah/page.tsx` & `app/masuk/page.tsx` | Menjalankan *authorization guard* sisi server (`await bacaSesi()`), menyusun tata letak halaman, SEO metadata, dan merender form secara aman tanpa membebani ukuran bundle JavaScript klien. |
| **Client Component** | `components/FormItem.tsx` & `components/FormMasuk.tsx` | Ditandai `"use client"`. Menggunakan *hook* React 19 `useActionState` untuk mengikat formulir dengan Server Action, menangani status `pending` (animasi tombol saat proses simpan), menampilkan galat per kolom dengan aksesibilitas ARIA (`aria-invalid`, `aria-describedby`), dan mempertahankan nilai isian input saat terjadi galat validasi. |
| **Server Action ("use server")** | `app/produk/actions.ts` & `app/masuk/actions.ts` | Ditandai `"use server"` di baris paling atas. Merupakan titik masuk API internal yang dieksekusi secara aman di lingkungan server Node.js. Menangani validasi skema, logika bisnis, mutasi data, dan manipulasi *cookie* HTTP. |
| **Modul Sesi & Skema Validasi** | `schema/sesi.ts`, `schema/skema.ts`, `schema/status-form.ts` | Disimpan di folder khusus `schema/` sesuai standar industri. `schema/sesi.ts` ditandai `import "server-only";` untuk menjamin tidak dapat diimpor oleh Client Component, mencegah kebocoran logika rahasia atau kredensial ke peramban. |


## 3. Bukti Uji Validasi

### Tabel Kasus Uji Formulir Tambah Varietas & Pemesanan

| No | Modul / Halaman | Masukan Data Pengujian | Status Validasi Klien | Hasil yang Diharapkan | Hasil Nyata (Sistem) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | Tambah Varietas | Nama: "D" (1 huruf), Kategori: "lokal", Harga: 50000, Deskripsi: "Durian enak harum manis" | Klien Aktif | Muncul peringatan HTML5 minlength & galat Zod "Judul/nama varietas minimal 3 karakter" | Sesuai (kolom bergaris merah, pesan galat muncul di bawah input) |
| 2 | Tambah Varietas | Nama: "Durian Tembaga", Kategori: Kosong (tidak dipilih), Harga: 50000, Deskripsi: "Daging tebal legit" | Klien Aktif | Galat Zod "Pilih salah satu kategori varietas" | Sesuai (galat select ditampilkan, status pending berhenti) |
| 3 | Tambah Varietas | Nama: "Durian Montong", Kategori: "premium", Harga: 75000, Deskripsi: "Durian montong super legit manis bergaransi" | **Dilewati (`novalidate`)** | Ditolak oleh Validasi Semantik: "Varietas durian dengan nama ini sudah terdaftar di katalog kebun." | Sesuai (server mendeteksi nama sudah ada di `lib/data.ts`, input tetap tersimpan) |
| 4 | Tambah Varietas | Nama: "Durian Senapelan Pekanbaru", Kategori: "lokal", Harga: 5000 (di bawah minimum), Deskripsi: "Durian langka khas Senapelan" | **Dilewati (`novalidate`)** | Ditolak oleh Skema Zod Server: "Harga per kilogram minimal Rp10.000" | Sesuai (ditolak di server, nilai form tidak hilang) |
| 5 | Tambah Varietas | Nama: "Durian Kampar Legit", Kategori: "unggulan", Harga: 65000, Deskripsi: "Singkat" (7 karakter) | **Dilewati (`novalidate`)** | Ditolak oleh Skema Zod Server: "Deskripsi rasa & panen minimal 10 karakter" | Sesuai (ditolak di server, pesan galat deskripsi ditampilkan) |
| 6 | Tambah Varietas | Nama: "Durian Asynur Kampar 2026", Kategori: "premium", Harga: 85000, Deskripsi: "Hasil panen pohon induk kebun Kampar dengan tekstur creamy mentega tanpa serat", Tersedia: dicentang | Klien Aktif | Sukses: Data tersimpan, revalidasi cache, dan diarahkan ke `/produk/durian-asynur-kampar-2026` | Sesuai (redirect otomatis ke halaman detail produk baru) |
| 7 | Portal Masuk | Email: "pengelola@aduri.riau", Sandi: "sandi-salah-123" | Klien Aktif | Ditolak dengan pesan: "Email atau kata sandi pengelola salah." | Sesuai (notifikasi `role="status"` berwarna merah muncul) |
| 8 | Form Pembayaran | Nama: "Budi123", Telepon: "081234567890", Wilayah: "Pekanbaru", Alamat: "Jl. Sudirman No. 10", Jumlah: 2 | Klien Aktif | Ditolak regex: "Nama lengkap harus diisi dengan huruf abjad (tidak boleh mengandung angka atau simbol)" | Sesuai (kolom Nama Lengkap menampilkan galat regex) |

### Tangkapan Layar Galat Per Kolom
- **Gambar 1**: Tampilan galat validasi per kolom pada formulir penambahan varietas.
!["Pengujian Galat pada Penamaan Varietas"](./image/modul-05/Uji%20Penamaan%20Varietas.png)
!["Pengujian Galat pada Pemilihan Kategori Varietas"](./image/modul-05/Ujian%20Pengisian%20Kategori.png)
!["Pengujian Galat pada Pengisian Nama Pembeli](./image/modul-05/Uji%20Nama%20Pembeli%20dengan%20Angka.png)
- **Gambar 2**: Tampilan galat validasi semantik (duplikasi nama varietas durian yang sudah ada).
!["Pengujian Penambahan Produk Duplikat"](./image/modul-05/Uji%20Duplikasi%20Varietas.png)
- **Gambar 3**: Tampilan formulir dengan atribut `novalidate` yang berhasil ditangkap oleh validasi server Zod 4.
!["Pengujian Pengisian Deskripsi yang Tidak Sesuai"](./image/modul-05/Uji%20Pengisian%20Deskripsi.png)
!["Pengujian Penambahan Produk Duplikat"](./image/modul-05/Uji%20Duplikasi%20Varietas.png)
![Pengujian Pengisian Harga"](./image/modul-05/Uji%20Pengisian%20Harga.png)

## 4. Session dan Cookie

### Atribut Cookie Sesi dan Alasan Pemilihannya

Pada `schema/sesi.ts`, *cookie* sesi pengelola dibuat dengan konfigurasi keamanan tingkat enterprise:

```typescript
(await cookies()).set("sesi", id, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 8, // 8 jam
});
```

| Atribut Cookie | Nilai Konfigurasi | Alasan Keamanan dan Bisnis |
| :--- | :--- | :--- |
| `httpOnly` | `true` | **Mencegah Pencurian Sesi via XSS (Cross-Site Scripting)**. Skrip JavaScript pada sisi peramban (`document.cookie`) tidak memiliki akses membaca nilai cookie ini sama sekali. |
| `secure` | `true` (pada lingkungan production) | **Mencegah Penyadapan Man-in-the-Middle (MitM)**. Cookie hanya akan dikirimkan melalui protokol terenkripsi HTTPS. |
| `sameSite` | `"lax"` | **Mitigasi Serangan CSRF (Cross-Site Request Forgery)**. Cookie tidak akan dikirimkan pada permintaan lintas situs pihak ketiga (seperti iframe pihak luar), tetapi tetap dikirimkan ketika pengguna mengeklik tautan navigasi normal menuju situs ADuri. |
| `path` | `"/"` | Memastikan status autentikasi pengelola berlaku menyeluruh di seluruh rute aplikasi (portal `/masuk`, `/produk`, hingga `/produk/tambah`). |
| `maxAge` | `28800` (8 Jam) | Menetapkan masa aktif sesi kerja pengelola selama jam operasional harian kebun (8 jam kerja). Setelah durasi terlewati, sesi otomatis kedaluwarsa demi keamanan. |

### Hasil Uji Skenario Keamanan Session & Cookie

1. **Uji Cookie Palsu (Manipulasi Manual di DevTools)**:
  !["Ketika Value Cookie Dimanupulasi"](./image/modul-05/Tampilan%20ketika%20Value%20Diganti.png)
2. **Uji Logout**:
   ![](./image/modul-05/Tampilan%20ketika%20Logout.png)
3. **Uji Cookie Lama Setelah Logout (Replay Attack)**:
  !["Masuk Menggunakan Value Cookie Sebelumnya"](./image/modul-05/Tampilan%20Ketika%20mengisi%20Value%20dengan%20Value%20Sesi%20Sebelumnya.png)

## 5. Keputusan Teknis

### Mengapa Pola Session di Server Dipilih Dibanding Token di Cookie (Stateless JWT)?

1. **Kemampuan Pencabutan Sesi Seketika (*Instant Revocation*)**:
   - Jika kredensial staf pengelola dicurigai bocor, admin dapat segera menghapus sesi dari memori server (`penyimpanan.delete(id)`).
   - Pada stateless JWT murni, token yang sudah diterbitkan akan tetap valid di sisi peramban sampai masa kedaluwarsa alami berakhir, kecuali dibuat infrastruktur *token blocklist* rumit yang pada akhirnya tetap membutuhkan penyimpanan status di server.
2. **Ukuran Header HTTP Lebih Ringkas**:
   - Cookie sesi server hanya membawa ID UUID acak sepanjang 36 karakter (`crypto.randomUUID()`), sehingga header permintaan HTTP sangat ringan dibanding JWT yang membawa payload terenkripsi besar.
3. **Pemisahan Data Sensitif**:
   - Informasi profil pengguna disimpan secara terpusat di server dan tidak diekspos di dalam string cookie di sisi klien.

### Batas Peran `proxy.ts` Dibanding Pemeriksaan di Server Action / Server Component

Arsitektur keamanan ADuri menerapkan prinsip pertahanan berlapis (*defense-in-depth*):

```
Permintaan Klien ──> [proxy.ts (Network Edge)] ──> [Server Component] ──> [Server Action]
                           (Penyaring Kasar)           (Penjaga Tampilan)       (Penjaga Mutasi)
```

1. **Peran `proxy.ts` (Next.js Middleware)**:
   - Berfungsi sebagai **Penyaring Cepat di Lapisan Terdepan (Edge Guard)**.
   - Hanya melakukan pemeriksaan optimistik: apakah *cookie* `sesi` ada atau tidak.
   - Jika tidak ada, permintaan langsung dibelokkan ke `/masuk` sebelum Next.js membuang komputasi untuk merender pohon komponen React.
   - **Batasan**: Middleware berjalan di Edge Runtime yang tidak memiliki akses langsung ke modul Node.js internal, database relasional lengkap, atau Map server terpusat. Oleh karena itu, middleware **tidak boleh** dijadikan satu-satunya benteng keamanan.
2. **Peran Pemeriksaan di Server Component & Server Action**:
   - Berfungsi sebagai **Otorisasi Definitif (*Source of Truth*)**.
   - Server Component memanggil `bacaSesi()` untuk memastikan token tersebut benar-benar ada di memori server dan belum kedaluwarsa.
   - Server Action `simpanItem` kembali memeriksa `bacaSesi()` sebelum melakukan mutasi data, memastikan bahwa manipulasi HTTP langsung (seperti melalui cURL, Postman, atau eksploitasi skrip) tidak akan pernah bisa menyimpan produk tanpa sesi yang sah.

---

## 6. Kendala dan Penyelesaian

| No | Kendala yang Dihadapi | Akar Masalah | Solusi & Penyelesaian |
| :---: | :--- | :--- | :--- |
| 1 | Peringatan deprecation Zod 4 pada metode `.flatten()` | Zod versi 4 mengubah API penanganan galat dan merekomendasikan `z.flattenError()` daripada metode `error.flatten()` pada objek instans ZodError. | Mengubah pemanggilan menjadi `z.flattenError(hasil.error).fieldErrors` di semua Server Action (`simpanItem`, `masuk`). |
| 2 | Nilai isian input select reset setelah terjadi galat validasi server | Elemen `<select>` di React memerlukan re-render sinkron dengan nilai `defaultValue` yang baru setelah respon dari Server Action diterima. | Menambahkan properti dinamis `key={status.nilai?.kategori ?? "awal"}` pada elemen `<select>` agar React me-remount komponen input dengan nilai isian sebelumnya. |
| 3 | Pengalihan `redirect()` tertangkap sebagai galat jika diletakkan di dalam blok `try` | Next.js mengimplementasikan fungsi `redirect()` dengan melempar *exception* internal (`NEXT_REDIRECT`). Jika dibungkus blok `try-catch`, galat ini ditangkap sebagai kesalahan program. | Memindahkan eksekusi `redirect()` ke luar blok `try-catch` setelah proses mutasi data selesai dengan sukses. |
| 4 | Kebutuhan merapikan rute tanpa mengubah struktur URL publik | Penempatan formulir di bawah folder `schema` dapat merusak URL jika nama foldernya menjadi segmen rute. | Memanfaatkan fitur **Route Groups** Next.js dengan menamai folder `app/(schema)/` sehingga halaman `/pembayaran` dan `/ambil-sendiri` tetap memiliki URL bersih dan intuitif. |

---

## 7. Catatan Pemanfaatan AI

- **Alat yang Digunakan**: Antigravity AI Assistant (Google DeepMind).
- **Perintah Utama yang Diberikan**:
  1. Identifikasi dan rancang arsitektur formulir validasi berbasis Zod 4 dan Server Action sesuai panduan Modul 5 Praktikum PAW 2026.
  2. Implementasikan alur autentikasi pengelola kebun (`/masuk`), proteksi rute dengan `proxy.ts`, dan formulir penambahan varietas panen (`/produk/tambah`).
  3. Buat aturan validasi semantik untuk mencegah duplikasi nama varietas durian pada katalog aktif.
- **Bagian yang Dihasilkan / Dibantu AI**:
  - Penyusunan skema Zod 4 (`skemaItem`, `skemaMasuk`, `skemaPembayaran`, `skemaKunjungan`) pada `schema/skema.ts`.
  - Penulisan Server Action 5-tahap pada `app/produk/actions.ts` dan manajemen sesi berbasis cookie `HttpOnly` pada `schema/sesi.ts`.
  - Struktur komponen React 19 `useActionState` dengan aksesibilitas ARIA pada `FormItem.tsx` dan `FormMasuk.tsx`.
- **Cara Memverifikasi Hasil AI**:
  1. Melakukan pemeriksaan tipe menyeluruh dengan `npx tsc --noEmit` untuk memastikan tidak ada kesalahan tipe data.
  2. Menjalankan pengujian otomatis unit dan kriptografi menggunakan `npm test` (seluruh 8 pengujian lulus).
  3. Menjalankan kompilasi produksi `npm run build` dengan Turbopack untuk memastikan semua halaman statis dan parsial berhasil digenerasi tanpa galat.
  4. Melakukan uji fungsional langsung di peramban dengan memasukkan data valid, data tidak valid (termasuk melewati validasi klien dengan `novalidate`), uji cookie palsu, dan uji logout.