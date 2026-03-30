# Panduan Menghubungkan AI ke Proxmox (Remote Execution)

Sebagai agent AI (Antigravity), saya beroperasi di dalam **IDE/Komputer Lokal Anda (Windows)**. Saya *tidak* diinstal sebagai aplikasi di dalam Proxmox. 

Namun, agar saya bisa "berjalan" dan mengonfigurasi server Proxmox Anda secara langsung (seolah-olah saya ada di sana), kita menggunakan metode **SSH Remote Execution**.

## Konsep Kerja:
Setiap kali Anda meminta saya untuk "Install ERPNext di server", saya akan membuat dan menjalankan bash script atau *Perintah SSH* dari Windows Anda untuk masuk langsung ke dalam LXC Linux Anda dan mengeksekusinya secara absolut.

---

## Langkah 1: Setup Kunci SSH (Agar AI bisa masuk tanpa password)

Buka terminal/powershell di dalam VS Code (Windows Anda), dan jalankan perintah ini jika belum pernah punya SSH Key:
```powershell
ssh-keygen -t ed25519 -C "admin_pc_lokal"
```
*(Tekan Enter saja hingga selesai untuk seluruh pertanyaan tanpa password)*

Setelah kunci dibuat, kita perlu menyalin (meng-*copy*) kunci publik Anda ke masing-masing LXC yang sudah Anda siapkan:

**Jalankan di terminal lokal Anda (Ganti `[user]` dengan `root`):**
```powershell
# Akses Proxmox Node Utama
ssh-copy-id root@pve.7sembilan.my.id

# Akses NPM (LXC)
ssh-copy-id root@proxym.7sembilan.my.id

# Akses Node.js (LXC)
ssh-copy-id root@webapp.7sembilan.my.id

# (Ulangi untuk hosting, erp, dan asset)
```

---

## Langkah 2: Contoh AI Menjalankan Perintah Jarak Jauh
Setelah SSH Key terpasang, Anda tinggal memberi tahu AI sebuah perintah. Contoh:
*"Antigravity, tolong buatkan folder 'web-portal', berikan izin, dan transfer source code yang baru tadi kita buat lalu jalankan instalasi NPM di server webapp `webapp.7sembilan.my.id`!"*

Maka, saya (Antigravity) akan men-generate dan menjalankan script otomasi dari lokal Anda seperti ini:
```powershell
# (Ini akan berjalan dengan otomatis melalui terminal Windows Anda)
scp -r ./web-portal root@webapp.7sembilan.my.id:/root/
ssh root@webapp.7sembilan.my.id "cd /root/web-portal && npm install && npm start"
```

## Alternatif: Remote SSH Extension (VS Code)
Cara lain yang jauh lebih "native" dan *Powerful*:
1. Install Ekstensi **Remote - SSH** di VS Code Windows Anda.
2. Klik tombol warna **Hijau** di sudut kiri bawah layar (><).
3. Pilih "Connect to Host", lalu masukkan `root@webapp.7sembilan.my.id`.
4. Buka folder kerja di sana (`/root/web-portal`).
5. Panggil saya (Antigravity) lagi di *Chatbox* tersebut.

Dengan cara ini, saya (AI) akan secara harfiah "berpindah raga" dan hidup tepat di dalam memori LXC Ubuntu Anda, membaca direktori Linux, dan menjalankan perintah linux Native (tanpa Powershell penghubung).
