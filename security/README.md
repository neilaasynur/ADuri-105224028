# Security Lab & Assessment Scope — ADuri 🌿

Dokumen ini mendokumentasikan spesifikasi laboratorium, ruang lingkup pengujian, dan arsitektur pengujian keamanan siber pada sistem **ADuri (Kebun Durian Keluarga Asynur)** untuk pemenuhan **Tugas 2: Kontrol Akses dan System Hardening (Penanda `sec-0.2`)**.

---

## 1. Spesifikasi Lingkungan Laboratorium (Lab Environment)

| Komponen | Spesifikasi / Konfigurasi | Keterangan |
|---|---|---|
| **Sistem Operasi Host** | Ubuntu 24.04 LTS (x86_64) | Virtual Machine uji keamanan |
| **Virtualisasi / Hypervisor**| VirtualBox 7.x / Proxmox VE | Isolasi lingkungan jaringan tertutup |
| **Container Engine** | Docker Engine 24.0+ & Docker Compose v2 | Runtime aplikasi terisolasi |
| **Web Application Stack**| Next.js 16 (App Router) + TypeScript + Node.js 20 | Frontend & Backend API |
| **Database Server** | PostgreSQL 16 (Dockerized, Private Subnet) | Penyimpanan data katalog & pesanan |
| **Alat Audit Sistem** | Lynis 3.0.9 (CIS Benchmark & Linux Security Audit)| Evaluasi indeks pengerasan OS |
| **Alat Scan Container** | Trivy 0.58.0 (Aqua Security) | Pemindaian CVE image container |
| **Alat Generator SBOM** | Syft 1.18.0 / Trivy CycloneDX Exporter | Pembuatan Software Bill of Materials |

---

## 2. Ruang Lingkup Pengujian (Assessment Scope)

### In-Scope (Dalam Cakupan):
1. **Lapisan Aplikasi Web (Next.js):**
   - Matriks kontrol akses berbasis peran (RBAC) pada endpoint katalog, pesanan, dan administrasi kebun.
   - Verifikasi penyimpanan kata sandi menggunakan fungsi hash lambat (Bcrypt cost factor 12).
   - Penolakan akses tidak sah (*fail-closed*) dan pencegahan celah IDOR (*Insecure Direct Object Reference*).
2. **Lapisan Sistem Operasi VM (Host Hardening):**
   - Pengerasan OpenSSH: pembatasan akses root, autentikasi berbasis kunci publik saja, pembatasan *max tries*.
   - Parameter kernel Linux (`sysctl` network hardening: proteksi SYN flood, IP spoofing, ICMP redirects).
   - Audit kepatuhan keamanan Lynis dengan target skor indeks $\ge 70$.
3. **Lapisan Container (Docker Hardening):**
   - Eksekusi container sebagai pengguna non-root (`USER node`, UID 1000).
   - Pembatasan kapabilitas kernel Linux (`cap_drop: ALL`, `no-new-privileges: true`).
   - Isolasi port: database PostgreSQL berjalan di jaringan internal Docker tanpa port binding publik.
   - Pemindaian kerentanan image (sebelum vs sesudah) hingga **0 kerentanan CRITICAL**.
   - Penyusunan inventaris rantai pasok perangkat lunak (SBOM format CycloneDX JSON).

### Out-of-Scope (Di Luar Cakupan Tugas 2):
* Pengujian penetrasi jaringan publik eksternal (terjadwal pada Final Project).
* Serangan Distributed Denial of Service (DDoS) skala volumetrik tinggi.
* Rekayasa sosial (*social engineering*) terhadap pemilik kebun keluarga.

---

## 3. Struktur Berkas Artefak Keamanan (`security/`)

Sesuai ketentuan dosen pada struktur repositori MeterLog:
```
security/
├── README.md               # Spesifikasi lab dan scope pengujian (dokumen ini)
├── asset-inventory.md      # [Tugas 1] Inventaris aset data, software, & host
├── dfd.md                  # [Tugas 1] DFD Level 1 & Trust Boundaries
├── threat-model.md         # [Tugas 1] Pemodelan ancaman 12 STRIDE
├── risk-register.md        # [Tugas 1] Daftar risiko & kontrol mitigasi
├── access-tests.md         # [Tugas 2] Matriks RBAC & uji akses sah vs tidak sah
├── hardening-notes.md      # [Tugas 2] Catatan pengerasan SSH, OS, dan Docker
├── lynis-before.txt        # [Tugas 2] Log audit Lynis sebelum hardening (Skor 59)
├── lynis-after.txt         # [Tugas 2] Log audit Lynis sesudah hardening (Skor 76 >= 70)
├── image-scan-before.txt   # [Tugas 2] Scan Trivy awal (memuat kerentanan CRITICAL)
├── image-scan-after.txt    # [Tugas 2] Scan Trivy akhir (0 CRITICAL)
└── sbom.cdx.json           # [Tugas 2] Software Bill of Materials format CycloneDX
```

---

*Disusun oleh: Neila Faaizah Asynur — 105224028*  
*Milestone: `sec-0.2`*
