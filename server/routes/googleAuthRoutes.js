const express    = require('express');
const passport   = require('passport');
const { googleCallback } = require('../controllers/Googleauthcontroller');
const router     = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// 1. Google-a yönləndir
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2. Google callback → controller
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) {
            console.error('\n🔴 PASSPORT XƏTASI:', err.message || err);
            return res.redirect(`${CLIENT_URL}/signin?error=google_failed&details=passport_err`);
        }
        if (!user) {
            console.error('\n🔴 GOOGLE USER TAPILMADI:', info);
            return res.redirect(`${CLIENT_URL}/signin?error=google_failed&details=no_user`);
        }
        req.user = user;
        next();
    })(req, res, next);
}, googleCallback);

// 3. Mövcud user
router.get('/me', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Giriş yox' });
    res.json({ user: req.user });
});

// 4. Çıxış
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.clearCookie('token');
        res.json({ ok: true });
    });
});

module.exports = router;