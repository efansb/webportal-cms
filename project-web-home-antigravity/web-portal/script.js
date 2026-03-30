// Web Portal interactions & Clock

function updateClock() {
    const now = new Date();
    
    // Time Formatting
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    const timeString = `${hours}:${minutes} ${ampm}`;
    document.getElementById('current-time').textContent = timeString;

    // Date Formatting (Indonesian)
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const dateString = now.toLocaleDateString('id-ID', options);
    document.getElementById('current-date').textContent = dateString;
}

// Update clock immediately, then every second
updateClock();
setInterval(updateClock, 1000);

// --- Backend API Integration ---
const API_URL = '/api';

async function fetchDynamicData() {
    try {
        // 1. Fetch & Render Announcements
        const annRes = await fetch(`${API_URL}/announcements/latest`);
        if (annRes.ok) {
            const announcements = await annRes.json();
            renderAnnouncements(announcements);
        }

        // 2. Fetch & Render Agenda
        const agendaRes = await fetch(`${API_URL}/agenda/upcoming`);
        if (agendaRes.ok) {
            const agendas = await agendaRes.json();
            renderAgendas(agendas);
        }

        // 3. Fetch & Render Applications Grid
        const appRes = await fetch(`${API_URL}/apps`);
        if (appRes.ok) {
            const apps = await appRes.json();
            renderApps(apps);
        }

    } catch (error) {
        console.error("Gagal terhubung ke Backend API:", error);
        // Fallback or show error state on UI
    }
}

function renderAnnouncements(data) {
    const container = document.getElementById('announcements-container');
    if (!container || !data.length) return;
    
    container.innerHTML = '';
    data.forEach(item => {
        let badgeColor = item.type === 'urgent' ? 'bg-red-500/20 text-red-300 border-red-500/20' : 
                         item.type === 'warning' ? 'bg-orange-500/20 text-orange-300 border-orange-500/20' : 
                         'bg-blue-500/20 text-blue-300 border-blue-500/20';

        const html = `
            <div class="mb-3">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor} border mb-1 inline-block uppercase">${item.type}</span>
                <p class="text-sm text-white/90 leading-snug">${item.content}</p>
                <div class="text-xs text-white/40 mt-1">${new Date(item.created_at).toLocaleDateString('id-ID')}</div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });

    // Handle Notification Bell Badge if there's urgently content
    const hasUrgent = data.some(d => d.type === 'urgent' || d.type === 'warning');
    const badge = document.getElementById('notif-badge');
    if (badge && hasUrgent) badge.classList.remove('hidden');
}

function renderAgendas(data) {
    const container = document.getElementById('agenda-container');
    if (!container || !data.length) return;

    container.innerHTML = '';
    data.forEach(item => {
        const date = new Date(item.start_time);
        const month = date.toLocaleString('id-ID', { month: 'short' });
        const day = date.getDate();
        const time = date.toLocaleString('id-ID', { hour:'2-digit', minute:'2-digit' });

        const html = `
            <div class="bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/5 transition-colors cursor-pointer group">
                <div class="flex items-start gap-3">
                    <div class="w-12 h-12 rounded-lg bg-white/10 text-white/80 flex flex-col items-center justify-center flex-shrink-0 border border-white/20">
                        <span class="text-[10px] font-bold uppercase mt-1 leading-none">${month}</span>
                        <span class="text-lg font-bold leading-none mt-1">${day}</span>
                    </div>
                    <div>
                        <h4 class="font-medium text-sm text-white group-hover:text-blue-300 transition-colors line-clamp-1">${item.title}</h4>
                        <p class="text-xs text-white/60 mt-1 flex items-center gap-1">
                            <i data-lucide="clock" class="w-3 h-3"></i> ${time} | ${item.location || 'TBA'}
                        </p>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
    // Re-init lucide icons for newly added elements
    lucide.createIcons();
}

function renderApps(data) {
    const container = document.getElementById('app-grid-container');
    if (!container || !data.length) return;

    // Clear static HTML placeholder
    container.innerHTML = '';
    
    data.forEach(app => {
        const html = `
            <a href="${app.url}" target="_blank" class="app-icon-wrapper group">
                <div class="app-icon bg-gradient-to-br ${app.gradient_from} ${app.gradient_to} ${app.shadow_color}">
                    <i data-lucide="${app.icon_name}" class="w-9 h-9 text-white group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <span class="app-label mt-2">${app.name}</span>
            </a>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
    lucide.createIcons();
}

// Call Fetch on load
document.addEventListener('DOMContentLoaded', fetchDynamicData);
