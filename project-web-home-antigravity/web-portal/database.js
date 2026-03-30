const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'portal.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // 1. Users Table (SSO IdP Master Table)
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 2. Agenda Table
        db.run(`CREATE TABLE IF NOT EXISTS agendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            start_time DATETIME NOT NULL,
            end_time DATETIME,
            location TEXT,
            color TEXT DEFAULT 'blue',
            created_by INTEGER,
            FOREIGN KEY (created_by) REFERENCES users (id)
        )`);

        // 3. Announcements/Info Table
        db.run(`CREATE TABLE IF NOT EXISTS announcements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            type TEXT DEFAULT 'info', -- 'info', 'warning', 'urgent'
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_by INTEGER,
            FOREIGN KEY (created_by) REFERENCES users (id)
        )`);

        // 4. Applications Table
        db.run(`CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            icon_name TEXT NOT NULL, -- lucide icon string
            gradient_from TEXT,
            gradient_to TEXT,
            shadow_color TEXT,
            display_order INTEGER DEFAULT 0
        )`);

        // Insert Default Admin User (password: admin123)
        // Note: In real production, hash this! We'll hash it in server.js, but for init we do it manually if empty.
        const bcrypt = require('bcryptjs');
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('admin123', salt);
        
        db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
            if (row.count === 0) {
                db.run(`INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`, 
                    ['admin', 'admin@perusahaan.com', hash, 'admin']);
                console.log('Default admin user created.');
                
                // Insert Sample Data
                db.run(`INSERT INTO announcements (title, content, type) VALUES ('Welcome', 'Selamat datang di Enterprise OS Portal.', 'info')`);
                
                db.run(`INSERT INTO applications (name, url, icon_name, gradient_from, gradient_to, shadow_color, display_order) VALUES 
                    ('ERP System', 'https://erp.perusahaan.com', 'briefcase', 'from-blue-500', 'to-indigo-600', 'shadow-blue-500/50', 1),
                    ('Assets Mgt', 'https://aset.perusahaan.com', 'tool', 'from-emerald-400', 'to-teal-600', 'shadow-teal-500/50', 2)
                `);
            }
        });
    });
}

module.exports = db;
