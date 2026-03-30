# Panduan Administrasi Server (Proxmox & LXC)
*(Draft/Kerangka Dasar)*

Dokumen ini akan terus diperbarui seiring berjalannya proyek. Panduan ini ditujukan untuk tim IT yang akan mengelola infrastruktur server perusahaan.

## 1. Akses Proxmox VE
- **URL GUI:** `https://[IP-Lokal-Server]:8006`
- **User:** `root` (PAM Authentication)
- **Password:** *(Akan diberikan secara aman setelah setup selesai)*

## 2. Manajemen LXC (Linux Containers)
- **Monitoring:** Lihat grafik CPU, RAM, dan Net/IO pada menu `Summary` di tiap node/LXC.
- **Konsol:** Gunakan fitur `>_ Console` di Proxmox untuk mengakses shell root tiap container tanpa perlu SSH dari luar.
- **Backup:** Lakukan penjadwalan backup otomatis via menu `Datacenter -> Backup`. Disarankan membackup ERPNext (LXC 2) dan openMAINT (LXC 3) setiap hari.

## 3. Gateway & Reverse Proxy (Nginx Proxy Manager)
- Semua traffic HTTP/HTTPS dari internet di-handle oleh container ini.
- Untuk menambahkan domain baru (misal `baru.namaperusahaan.com`), masuk ke GUI NPM, tambahkan *Proxy Host*, arahkan ke IP lokal LXC tujuan, dan request SSL *Let's Encrypt* secara otomatis.

## 4. Maintenance Rutin
- **Update OS Container:** Lakukan `apt update && apt upgrade -y` secara berkala di tiap LXC Ubuntu.
- **Restart Layanan:** Jika ERPNext bermasalah, restart container ERP atau gunakan perintah `bench restart` di dalamnya.
