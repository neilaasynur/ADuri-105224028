# Dokumen Teknis Modul 4: Next.js App Router
Nama/NIM : Neila Faaizah Asynur / 105224028   
Repositori : [https://github.com/neilaasynur/ADuri-105224028](https://github.com/neilaasynur/ADuri-105224028)   
Versi Next.js : Node.js 16.4.0   
dan mode Cache Components (aktif/tidak): Aktif (`cacheComponents: true`, `partialPrefetching: true`)   
## 1. Peta Rute
Berikut pemetaan rute aplikasi web Aduri yang telah dirancang:   
| URL | Berkas di `app/` | Jenis Rute | Isi Halaman |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | Statis | Beranda utama: Pengenalan kebun, pratinjau varietas durian unggul, dan sekilas profil kebun keluarga Asynur |
| `/produk` | `app/produk/page.tsx` | Statis | Katalog lengkap seluruh varietas durian beserta filter & harga. |
| `/produk/[slug]` | `app/produk/[slug]/page.tsx` | Dinamis | Detail spesifik varietas durian berdasarkan parameter `slug`, menampilkan galeri foto, deskripsi cita rasa, parameter tekstur/kemanisan, dan tombol pemesanan. |
| `/tentang` | `app/tentang/page.tsx` | Statis | Profil lengkap Kebun Durian ADuri, sejarah perkebunan keluarga, media sosial ADuri, serta contact person yang dapat dihubungi oleh pembeli |
| `/ambil-sendiri` | `app/ambil-sendiri/page.tsx` | Statis | Formulir reservasi kunjungan langsung ke kebun Durian, integrasi rute Google Maps, pemilihan jam panen, dan konfirmasi WhatsApp. |
| `/pembayaran` | `app/pembayaran/page.tsx` | Dinamis (Search Params) | Formulir pemesanan resmi, pengisian alamat pengiriman wilayah Riau, pilihan pembayaran (QRIS/Transfer), dan konfirmasi order. |
| `/uji/lambat` | `app/uji/lambat/page.tsx` | Dinamis (Server connection) | Rute pengujian simulasi penundaan respons jaringan (2 detik) untuk mengamati aktivasi `loading.tsx`. |
| `/uji/galat` | `app/uji/galat/page.tsx` | Dinamis (Server connection) | Rute pengujian galat tak terduga (*runtime exception*) untuk mengamati penangkapan galat oleh error boundary `error.tsx`. |

Berikut ditampilkan tabel rute keluaran npm run build ketika dijalankan:
!["Hasil keluaran npm run build"](./image/modul-04/Hasil%20npm%20run%20build.png)

## 2. Layout, Template, dan Berkas Khusus
Setelah melakukan re-construct terhadap penyusunan file web, berikut pohon folder app/ yang terakhir
!["Pohon dari folder app/ yang terakhir](./image/modul-04/Hasil%20tree%20folder%20app.png)

Berikut saya lampikan pengujian terkait penggunaan layout dan template pada Web ADuri
### a. Pengujian Penggunaan layout
Berikut adalah tangkapan layar ketika pegujian layout
!["Tangkapan layar awal terkait pengujian layout"](./image/modul-04/Hasil%20awal%20pengujian%20layout.png)
Setelah melakukan searching pada halaman katalog, saya perpindah ke halaman beranda untuk melakukan pengujian terhadap penggunaan layout yang digunakan. Setelah di halaman beranda, saya kembali ke halaman katalog untuk melihat apakah hasil ketikan yang sebelumnya saya ketik masih bertahan atau malah hilang. Berikut hasil pengujian tersebut
!["Tangkapan layar akhir terkait pengujian layout"](./image/modul-04/Hasil%20akhir%20pengujian%20layout.png)
Pada penerapan ini, hasil ketikan yang saya buat masih tetap dan tidak hilang. Hal ini membuktikan jika penggunaan layout yang saya gunakan sudah bekerja sebagaimana mestinya.

### b. Pengujian Penggunaan Template
Berikut adalah tangkapan layar ketika pegujian template
!["Tangkapan layar awal terkait pengujian template"](./image/modul-04/Hasil%20awal%20pengujian%20template.png)
Setelah melakukan pengisian form pembelian di halaman pembayaran, saya perpindah ke halaman katalog dan memilih jenis durian lain yang ingin dibeli. Setelah di halaman katalog dan memilih jenis durian yang lain, saya kembali ke halaman pembayaran untuk melihat apakah ketikan yang sebelumnya saya ketik masih bertahan atau malah hilang. Berikut hasil pengujian tersebut
!["Tangkapan layar akhir terkait pengujian template"](./image/modul-04/Hasil%20akhir%20pengujian%20template.png)
Pada penerapan ini, hasil ketikan yang saya buat hilang. Hal ini membuktikan jika penggunaan template yang saya gunakan sudah bekerja sebagaimana mestinya.

Berikut saya lampikan pengujian terkait layar loading dan error pada Web ADuri
### a. Pengujian layar loading
Berikut tangkapan layar ketika melakukan loading di Web ADuri
!["Tangkapan layar loading"](./image/modul-04/Hasil%20pengujian%20loading.png)

### b. Pengujian layar error
Berikut tangkpaan layar ketikan ada error di Web ADuri
!["Tangkapan layar error"](./image/modul-04/Hasil%20pengujian%20error.png)

## 3. Rute Dinamis dan Validasi params   
| URL Diuji | Kategori | Hasil yang Diharapkan | Hasil Aktual | Kode Status HTTP (`curl.exe`) |
| :--- | :--- | :--- | :--- | :---: |
| `http://localhost:3000/produk/durian-montong` | Valid (Terdaftar) | Menampilkan detail lengkap Durian Montong Riau (spesifikasi, foto, harga). | Menampilkan halaman detail Durian Montong sesuai data. | `200 OK` |
| `http://localhost:3000/produk/durian-xyz` | Tidak Sah (Data tidak ada) | Mengalihkan ke `not-found.tsx` khusus segmen produk dengan pesan "Varietas Durian Tidak Ditemukan". | Muncul kartu `not-found` bertema durian tidak ditemukan. | `404 Not Found` |
| `http://localhost:3000/produk/DURIAN@MONTONG!` | Tidak Sah (Format karakter ilegal) | Ditolak oleh regex validasi dan menampilkan `not-found.tsx`. | Muncul pesan varietas durian tidak ditemukan. | `404 Not Found` |
| `http://localhost:3000/halaman-tidak-ada` | Tidak Sah (Rute luar tidak terdaftar) | Ditangani oleh `app/not-found.tsx` tingkat akar (*global 404*). | Muncul halaman 404 global "Halaman Tidak Ditemukan". | `404 Not Found` |   

Pada rute dinamis `/produk/[slug]`, parameter `slug` mewakili identifier unik varietas durian. Aturan validasi yang diterapkan pada [app/produk/[slug]/page.tsx](file:///d:/Kuliah/Semester%205/projek-web/app/produk/%5Bslug%5D/page.tsx):
1. **Aturan Sintaks (Format):** Nilai `slug` wajib berupa teks huruf kecil, angka, dan tanda hubung pemisah (`/^[a-z0-9-]+$/`). Jika terdapat karakter ilegal, spasi, atau huruf besar, fungsi `notFound()` langsung dipanggil.
2. **Aturan Semantik (Keberadaan Data):** Nilai `slug` dicocokkan dengan basis data lokal melalui fungsi `cariProduk(slug)` pada `lib/data.ts`. Jika durian dengan slug tersebut tidak terdaftar, fungsi `notFound()` dipanggil.
3. **Promise Await:** Sesuai standar Next.js 15+, prop `params` bertipe `Promise<{ slug: string }>` dan wajib di-`await` sebelum dibaca.

Berikut adalah tangkapan layar ketika saya melakukan perubahan pada params yang seharusnya "durian-kampung" menjadi "durian kampung".
!["Tangkapan layar not found"](./image/modul-04/Hasil%20pengujian%20perubahan%20pada%20params.png)

## 4. Pembagian Server dan Client Components

| Komponen / Berkas | Jenis Komponen | Alasan Teknis |
| :--- | :---: | :--- |
| `app/produk/[slug]/page.tsx` | **Server Component** | Menjalankan fungsi asinkron `await params`, mengeksekusi `generateMetadata`, membaca data dekat sumbernya, dan kodenya tidak perlu dikirim ke bundel JavaScript klien. |
| `components/TautanNav.tsx` | **Client Component** | Menggunakan React hook `usePathname()` dari `next/navigation` untuk mendeteksi rute aktif dan menyematkan atribut aksesibilitas `aria-current="page"`. |
| `components/KolomCatatan.tsx` | **Client Component** | Menggunakan hook interaktif `useState` dan `useId` untuk mengikat masukan pengguna ke state lokal komponen. |
| `components/layout/Navbar.tsx` | **Client Component** | Memiliki state interaktif `isOpen` untuk membuka/menutup menu navigasi responsif pada layar ponsel (*hamburger toggle*). |
| `components/layout/Footer.tsx` | **Server Component** | Berisi informasi hak cipta, kontak, dan tautan statis tanpa memerlukan event handler, state, maupun akses ke API browser. |
| `components/features/checkout/PaymentForm.tsx` | **Client Component** | Mengelola state formulir transaksi pemesanan (`fullName`, `phone`, `address`), perhitungan total dinamis, validasi input secara langsung (*live feedback*), dan event `onSubmit`. |
| `components/features/booking/BookingForm.tsx` | **Client Component** | Menangani logika pemilihan tanggal, waktu kunjungan kebun, validasi regex nomor HP Indonesia (`08...`), serta pembentukan URL tautan WhatsApp otomatis. |
| `app/uji/error.tsx` | **Client Component** | Wajib Client Component karena merupakan React Error Boundary yang menerima properti `error` dan fungsi `retry()`. |


Berikut saya lampirkan tangkapan layar pengujian pada impor lib/data.ts ke component tautan navbar
!["Pengujian pembatasan Modul `server-only`](./image/modul-04/Hasil%20pembatasan%20modul%20server-only.png)
## 5. Verifikasi
Berikut saya lampirkan tangkapan layar hasil npx tsc --noEmit, npm run lint, dan npm run build
!["Hasil verifikasi"](./image/modul-04/Hasil%20verifikasi.png)

## 6. Kendala dan Penyelesaian
Tidak ada
## 7. Catatan Pemanfaatan AI
1. **Alat AI:** Antigravity (Google DeepMind Agentic Coding Assistant).
2. **Perintah Utama:**
   - Melakukan audit kesesuaian proyek terhadap dokumen panduan *Modul 4 Praktikum PAW 2026*.
   - Merapikan struktur folder `components/` ke pola modular (`features/`, `layout/`, `ui/`).
   - Mengimplementasikan pengujian layout vs template (`KolomCatatan.tsx`, `layout.tsx`, `template.tsx`).
   - Menambahkan pengamanan batas server dengan modul `server-only`.
3. **Bagian yang Dihasilkan AI:**
   - Pemisahan komponen navigasi `TautanNav.tsx`, halaman `app/tentang/page.tsx`, rute simulasi `app/uji/`, serta berkas dokumentasi teknis `docs/praktikum/modul-04.md`.
4. **Cara Memverifikasi:**
   - Melakukan kompilasi tipe statis (`npx tsc --noEmit`).
   - Menjalankan seluruh rangkaian tes otomatis (`vitest run`).
   - Menjalankan build produksi Next.js 16.4 (`npm run build`) dan memastikan seluruh 16 halaman statis dan parsial terkompilasi dengan kode keluar 0.

