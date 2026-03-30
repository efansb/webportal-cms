# webportal-cms

Project ini adalah Enterprise OS Web Portal.

## Struktur utama
- `project-web-home-antigravity/web-portal`: source code aplikasi (Node.js + Express + SQLite + frontend static)
- `docs/`, `proxmox-scripts/`: dokumentasi dan skrip ops
- `Dockerfile`, `docker-compose.yml`: build container untuk deployment

## Jalankan lokal

1. `npm install`
2. `cd project-web-home-antigravity/web-portal`
3. `node server.js`
4. Buka `http://localhost:3000`

## Deploy ke Dokploy
Lihat `DOCKER_DEPLOY.md` untuk template dan step-by-step.
