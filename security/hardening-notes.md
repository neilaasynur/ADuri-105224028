# hardening-notes.md — Catatan Teknis Pengerasan Sistem & Container (Milestone sec-0.2)

Dokumen ini mendokumentasikan langkah-langkah teknis pengerasan (*system hardening*) pada lapisan **Sistem Operasi Host (VM Ubuntu 24.04 LTS)** dan **Lapisan Container (Docker)** untuk aplikasi **ADuri (Kebun Durian Keluarga Asynur)** sesuai kriteria **Tugas 2 (Penanda `sec-0.2`)**.

---

## 1. Pengerasan Sistem Operasi (Host OS Hardening — OpenSSH)

Untuk mencegah akses ilegal langsung ke server kebun dan kebocoran master key (**RSK-04**), server OpenSSH dikonfigurasi dengan standar keamanan tinggi:

### A. Konfigurasi OpenSSH (`/etc/ssh/sshd_config.d/99-aduri-hardened.conf`)
```ini
# Hanya izinkan autentikasi kunci publik (Ed25519 / RSA 4096)
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no

# Larang login langsung sebagai root
PermitRootLogin no

# Batasi jumlah percobaan autentikasi per sesi (mitigasi brute-force)
MaxAuthTries 3

# Nonaktifkan fitur yang tidak dibutuhkan untuk mengurangi attack surface
X11Forwarding no
AllowAgentForwarding no
PermitUserEnvironment no

# Batas waktu idle session
ClientAliveInterval 300
ClientAliveCountMax 2
```

### B. Bukti Verifikasi Konfigurasi SSH (Syarat Mutlak Rubrik)
Perintah verifikasi konfigurasi aktif SSH dijalankan menggunakan `sshd -T`:

```bash
sudo sshd -T | grep -E 'passwordauthentication|permitrootlogin'
```

**Keluaran Terminal Nyata:**
```text
passwordauthentication no
permitrootlogin no
```
*Status: Kedua parameter bernilai **no**, membuktikan bahwa login root dan login berbasis password teks telah diblokir sepenuhnya.*

---

## 2. Pengerasan Kernel & Jaringan OS (`/etc/sysctl.d/99-security.conf`)

Untuk memitigasi serangan DoS network flooding dan spoofing (**RSK-05**):
```ini
# Proteksi terhadap SYN Flood attack
net.ipv4.tcp_syncookies = 1

# Larang penerimaan ICMP redirects (mencegah Man-in-the-Middle)
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0

# Nonaktifkan IP Packet Forwarding (bukan router)
net.ipv4.ip_forward = 0

# Aktifkan Address Space Layout Randomization (ASLR penuh)
kernel.randomize_va_space = 2

# Batasi akses dmesg untuk pengguna non-root
kernel.dmesg_restrict = 1
```

---

## 3. Pengerasan Container Docker (Container Hardening)

Aplikasi ADuri di-container-kan menggunakan Docker dengan arsitektur pertahanan berlapis:

### A. Prinsip Non-Root User (Least Privilege)
* **Masalah:** Container yang berjalan sebagai `root` (UID 0) memiliki risiko tinggi bila terjadi *container breakout*, di mana penyerang dapat mengambil alih host server.
* **Solusi di `Dockerfile`:**
  * Menggunakan multi-stage build (`builder` $\to$ `runner`).
  * Pada stage akhir, proses dijalankan sebagai user `node` (UID 1000):
    ```dockerfile
    USER node
    ```

### B. Pembatasan Kapabilitas Linux Kernel (*Drop All Capabilities*)
* Di `docker-compose.yml`, seluruh kapabilitas root Linux dicabut:
  ```yaml
  cap_drop:
    - ALL
  security_opt:
    - no-new-privileges:true
  ```
  Opsi `no-new-privileges:true` menjamin bahwa proses di dalam container tidak dapat menaikkan hak aksesnya melalui binary SUID (seperti `sudo` atau `pkexec`).

### C. Isolasi Port & Jaringan Tertutup (Port Isolation)
* **Basis Data PostgreSQL:** Port `5432` **TIDAK DIPUBLIKASIKAN KE HOST ATAU INTERNET**. Database hanya dapat dijangkau oleh aplikasi Next.js melalui internal bridge network (`aduri-backend-net`).
* **Aplikasi Next.js:** Port `3000` hanya dibind ke localhost `127.0.0.1:3000` (atau di balik reverse proxy Caddy/Nginx) dan tidak terekspos langsung ke interface publik `0.0.0.0:3000`.

---

## 4. Evaluasi Indeks Audit Lynis (Target $\ge 70$)

Audit keamanan sistem operasi dilakukan menggunakan **Lynis 3.0.9 (CIS Benchmark Engine)**:

| Parameter Evaluasi | Sebelum Hardening (`lynis-before.txt`) | Sesudah Hardening (`lynis-after.txt`) | Perubahan & Mitigasi |
|---|:---:|:---:|---|
| **Hardening Index** | **59** | **76** | **Meningkat +17 poin** (Memenuhi kriteria minimal $\ge 70$) |
| **SSH Configuration** | WARNING (Root login & password auth enabled) | COMPLIANT (Pubkey only, root disabled) | SSH dilindungi kunci Ed25519 |
| **Kernel Hardening** | SUGGESTION (SYN cookies & redirects unhardened) | COMPLIANT (sysctl parameter 99-security) | Proteksi DoS & spoofing aktif |
| **File Permissions** | WARNING (Umask 022 terlalu terbuka) | COMPLIANT (Umask 027) | File sistem hanya dibaca pemilik |
| **Compiler Installed** | WARNING (`gcc` ada di server production) | COMPLIANT (`gcc` dicopot) | Penyerang tidak bisa compile exploit |

---

## 5. Pemetaan Rujukan Risiko (Tugas 1 $\to$ Tugas 2)

| Kontrol Hardening yang Diterapkan | ID Risiko Tugas 1 | Mekanisme Penurunan Risiko pada Produk ADuri |
|---|:---:|---|
| **SSH Pubkey Only & Root Login No** | **RSK-04** (Kebocoran Master Key `.env.local`) | Menghilangkan celah brute-force SSH password sehingga pihak luar tidak dapat mengakses filesystem server tempat master key disimpan. |
| **Container Non-Root (`USER node`)** | **RSK-02** (Eksfiltrasi Data Pelanggan) | Jika aplikasi web mengalami celah RCE, penyerang terperangkap sebagai user `node` non-privilege dan tidak dapat memodifikasi sistem operasi host. |
| **Port DB 5432 Isolated (No Direct Expose)** | **RSK-02** (SQL Injection / Direct DB Attack) | Database tidak bisa diakses langsung via internet IP server; hanya bisa diakses lewat aplikasi internal. |
| **Drop Capabilities & No New Privileges** | **RSK-05** (Eksploitasi Privilese & DoS) | Mencegah penyerang melipatgandakan thread komputasi atau mengeksekusi payload eksploitasi kernel di level container. |

---

*Disusun oleh: Neila Faaizah Asynur — 105224028*  
*Milestone: `sec-0.2`*
