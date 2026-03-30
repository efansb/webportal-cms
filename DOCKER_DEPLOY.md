# Dokploy Deployment Template

## Strukur repo
- Aplikasi utama ada di `project-web-home-antigravity/web-portal`
- Root Dockerfile mengarahkan ke subfolder ini
- Gunakan `docker-compose.yml` di root

## Langkah deploy ke Dokploy
1. Pastikan GitHub repository sudah ada (https://github.com/efansb/webportal-cms).
2. Di Dokploy UI (https://dokploy.7sembilan.my.id), tambahkan project baru:
   - Repository: `efansb/webportal-cms`
   - Branch: `main`
   - Build: `docker-compose up --build -d`
   - Optional: root build path `./` (tidak perlu subfolder karena Dockerfile di root)
3. Atur Environment variables:
   - `PORT=3000`
   - `SECRET_KEY` (ganti nilai ini dengan kunci aman)
   - `NODE_ENV=production`
4. Pastikan Dokploy mengizinkan port 3000 atau gunakan reverse proxy (Nginx) di VPS.

## Run lokal untuk testing
```
cd /workspaces/webportal-cms
docker compose up --build
```

## Endpoint setelah deploy
- `http://<dokploy-host>/` (frontend)
- `http://<dokploy-host>/api/...` (backend APIs)

## Kustomisasi
- Untuk mengganti `SECRET_KEY` pada produksi, edit variable melalui Dokploy UI.
- Pengaturan database sqlite berada di `data/portal.db`.
