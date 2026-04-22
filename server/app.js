const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const session   = require('express-session');
const passport  = require('./config/passport');
const errorHandler = require('./middleware/errorHandler');

// ─── Rate limiters ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dəqiqə
    max: 10,                   // max 10 cəhd
    message: { message: 'Çox sayda cəhd. 15 dəqiqə sonra yenidən cəhd edin.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 dəqiqə
    max: 100,            // max 100 sorğu
    message: { message: 'Çox sayda sorğu. Bir az gözləyin.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authRoutes = require('./routes/authRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const carRoutes = require('./routes/carRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const searchRoutes = require('./routes/searchRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes'); // ✅ YENİ
const adminRoutes = require('./routes/adminRoutes');
const destinationRoutes = require('./routes/destinationRoutes');

const app = express();

app.use(helmet());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://192.168.1.72:3000',
        'http://192.168.100.41:3000',
        'https://booking-app-blush-alpha.vercel.app',
        /\.vercel\.app$/,
    ],
    credentials: true,
}));

app.use(express.json());
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, 'uploads')));

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

app.use('/api/auth', authLimiter, authRoutes);
app.use('/auth',     authLimiter, googleAuthRoutes);
app.use('/api/buildings', apiLimiter, buildingRoutes);
app.use('/api/cars',      apiLimiter, carRoutes);
app.use('/api/flights',   apiLimiter, flightRoutes);
app.use('/api/bookings',  apiLimiter, bookingRoutes);
app.use('/api/search',    apiLimiter, searchRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/destinations', apiLimiter, destinationRoutes);

app.get('/', (req, res) => res.json({ message: 'API işləyir ✅' }));

app.use(errorHandler);

module.exports = app;