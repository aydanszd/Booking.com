const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');         // ✅ YENİ
const passport = require('./config/passport');      // ✅ YENİ
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const carRoutes = require('./routes/carRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const searchRoutes = require('./routes/searchRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes'); // ✅ YENİ

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Session + Passport ── diğer route'lardan ÖNCE olmalı ────────────────────
app.use(session({
    secret: process.env.SESSION_SECRET || 'gizli-degistir',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    },
}));
app.use(passport.initialize());
app.use(passport.session());
// ─────────────────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/search', searchRoutes);
app.use('/auth', googleAuthRoutes); 

app.get('/', (req, res) => res.json({ message: 'API işləyir ✅' }));

app.use(errorHandler);

module.exports = app;