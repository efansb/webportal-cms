# Panduan Instalasi ERPNext (via Frappe Docker)
# Berbeda dengan aplikasi lain, ERPNext sangat disarankan diinstall menggunakan repository resmi mereka karena strukturnya yang kompleks (terdiri dari Nginx, Python worker, Redis, MariaDB).

## Langkah-Langkah di LXC/VM ERPNext (Ubuntu 22.04):

1. **Install Docker & Git:**
   ```bash
   apt update && apt upgrade -y
   apt install -y git curl docker.io docker-compose-v2
   ```

2. **Clone Repository Resmi Frappe Docker:**
   ```bash
   git clone https://github.com/frappe/frappe_docker.git
   cd frappe_docker
   ```

3. **Buat File Environtment:**
   ```bash
   cp env-example .env
   # Buka .env dengan nano/vim dan ubah password database serta konfigurasi redis jika diperlukan.
   ```

4. **Jalankan ERPNext (Standar Setup):**
   ```bash
   docker compose -f pwd.yml up -d
   ```
   *(pwd.yml adalah konfigurasi single-bench yang paling cocok untuk dicoba di production skala kecil-menengah).*

5. **Akses & Setup Awal:**
   Akses ERPNext di browser melalui IP LXC Anda (misal `http://192.168.1.100:8080`). Selesaikan panduan setup Wizard (Buat Perusahaan, Akun, dst).
   
## Penghubungan ke Nginx Proxy Manager (Gateway)
Setelah ERPNext jalan, masuk ke Nginx Proxy Manager (http://Admin-IP-NPM:81):
- Tambahkan **Proxy Host**.
- Domain Names: `erp.namaperusahaan.com` (Sesuai pengaturan DNS / Cloudflare Anda).
- Forward Hostname / IP: `IP-LXC-ERPNext`.
- Forward Port: `8080`.
- Centang *Websockets Support* dan *Block Common Exploits*.
- Masuk ke tab SSL, *Request a new certificate* (Jika terhubung ke internet).
