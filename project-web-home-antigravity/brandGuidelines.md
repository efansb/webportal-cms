# Brand Guidelines & Design System

Panduan desain ini menjadi dasar dari *User Interface* Website Portal Informasi Perusahaan Anda. Desain ini secara khusus dirancang untuk memberikan pengalaman pengguna kelas *VVIP*.

## 1. Konsep Utama (UI/UX)
- **Tema Keseluruhan:** *iPad OS Home Screen / macOS Launchpad*. 
- **Vibe:** Clean, modern, dan sangat profesional.
- **Efek Visual:** **Glassmorphism**. Elemen-elemen antarmuka seperti memantulkan cahaya, berbentuk panel kaca yang agak transparan dengan efek *background-blur*.
- **Mikro-Animasi:**
  - Ikon membesar (*scaling*) perlahan ketika disorot (*hover*).
  - Cahaya berpendar (*glow*) di balik ikon aktif.
  - Transisi muncul halaman yang mulus.

## 2. Palet Warna (Color Palette)
Warna utama akan disesuaikan dengan identitas logo perusahaan saat ini, namun desain antarmukanya beradaptasi mengikuti *mood* warna latar belakang.
- **Background Utama:** *Mesh gradient* dinamis yang perlahan bergerak, atau sebuah gambar *wallpaper* pemandangan/abstrak estetis.
- **Panel / Kotak Kaca:** `rgba(255, 255, 255, 0.15)` dengan efek `backdrop-filter: blur(20px)` dan batas (border) super tipis putih.
- **Tipografi:** Putih (`#FFFFFF`) untuk mode latar gelap, atau Hitam Karbon (`#111111`) jika diganti ke tema cerah, dengan *drop-shadow* lembut agar tetap terbaca jelas.

## 3. Tipografi
- **Primary Font:** **Inter** atau **SF Pro** (Ramping, elegan, tidak bersudut kaku). Sangat mencitrakan nuansa teknologi modern.

## 4. Struktur Layar Utama (Home Screen)
## 4. Struktur Layar Utama (Home Screen)
Tampilan tidak memanjang ke bawah (tanpa *scroll* ekstrem), seluruh navigasi ada di tengah layar:
- **Header:** 
  - Kiri Atas: Logo & Nama Perusahaan.
  - Kanan Atas (eks-Dock): Menu interaktif sekunder (Profil Perusahaan, Logout, Settings Tema).
- **Area Konten Utama (Grid):**
  - **Sisi Kiri (App Grid):** Deretan "Aplikasi" (Ikon menu) yang digeser ke kiri.
    1. 🏢 **ERPNext** (Portal Pegawai & HR)
    2. 🛠️ **openMAINT** (Manajemen Aset)
    3. 📰 **Blog & Berita** (Ghost/WordPress)
    4. 🗨️ **Forum** (Flarum)
    5. 🎓 **Online Training** (Moodle)
    6. ☁️ **Cloud / File Directory** (Nextcloud)
  - **Sisi Kanan (Widget Kontainer):** Panel kaca khusus untuk Informasi, Agenda, dan Kalender (Dapat diinput oleh admin).
- **Footer (Bawah):** Logo perusahaan, Link/Icon Sosial Media, dan Copyright.
