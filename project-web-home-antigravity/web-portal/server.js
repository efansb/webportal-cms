const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'supersecret_enterprise_key_change_me';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files (HTML/CSS/JS)

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// --- AUTH API (Identity Provider / SSO Endpoint) ---
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
        
        const validPassword = bcrypt.compareSync(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
        
        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: '8h' }
        );
        res.json({ token, role: user.role, username: user.username });
    });
});

// Future SSO Validation Endpoint for ERPNext / openMAINT
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// --- PUBLIC API (For Home Dashboard) ---

// Get Applications
app.get('/api/apps', (req, res) => {
    db.all('SELECT * FROM applications ORDER BY display_order ASC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get Latest Announcements
app.get('/api/announcements/latest', (req, res) => {
    db.all('SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC LIMIT 5', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get Upcoming Agenda (For Calendar Widget)
app.get('/api/agenda/upcoming', (req, res) => {
    // Basic implementation: get future agendas (ignoring complex timezone handling for MVP)
    db.all('SELECT * FROM agendas ORDER BY start_time ASC LIMIT 10', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- ADMIN API (Requires Token & Admin Role) ---

// Create App Icon
app.post('/api/admin/apps', authenticateToken, requireAdmin, (req, res) => {
    const { name, url, icon_name, gradient_from, gradient_to, shadow_color, display_order } = req.body;
    db.run(
        `INSERT INTO applications (name, url, icon_name, gradient_from, gradient_to, shadow_color, display_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, url, icon_name, gradient_from, gradient_to, shadow_color, display_order || 0],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, name, url });
        }
    );
});

// Create Announcement (Triggers bell notification)
app.post('/api/admin/announcements', authenticateToken, requireAdmin, (req, res) => {
    const { title, content, type } = req.body;
    db.run(
        `INSERT INTO announcements (title, content, type, created_by) VALUES (?, ?, ?, ?)`,
        [title, content, type || 'info', req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, success: true });
        }
    );
});

// Create Agenda
app.post('/api/admin/agenda', authenticateToken, requireAdmin, (req, res) => {
    const { title, description, start_time, end_time, location, color } = req.body;
    db.run(
        `INSERT INTO agendas (title, description, start_time, end_time, location, color, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, description, start_time, end_time, location, color || 'blue', req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, success: true });
        }
    );
});

// Web Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise OS Backend listening on http://localhost:${PORT}`);
    console.log(`To start, run: npm install && npm start`);
});
