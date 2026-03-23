const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// GET /auth/google/callback — Passport uğurla qayıtdıqdan sonra işləyir
const googleCallback = async (req, res) => {
    try {
        const { id, name, email, avatar } = req.user;

        // DB-də user tap və ya yarat
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar,
                googleId: id,
                password:  'google-oauth', // normal login üçün deyil
            });
        } else if (!user.googleId) {
            // Eyni email ilə əvvəl qeydiyyatdan keçibsə googleId əlavə et
            user.googleId = id;
            await user.save();
        }

        // JWT yarat
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Token-i cookie-yə yaz və frontend-ə yönləndir
        res.cookie('token', token, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === 'production',
            maxAge:   7 * 24 * 60 * 60 * 1000, // 7 gün
        });

        // Uğurlu giriş logu (terminalda görünəcək)
        console.log(`\n✅ UĞURLU GOOGLE GİRİŞİ: ${user.name} (${user.email}) sistemə daxil oldu.`);

        res.redirect(`${process.env.CLIENT_URL}/?google_user=${encodeURIComponent(user.name)}`);

    } catch (err) {
        require('fs').writeFileSync('debug_error.txt', err.stack || err.toString());
        console.error('\n🔴 GOOGLE CALLBACK DB / JWT XƏTASI:', err);
        res.redirect(`${process.env.CLIENT_URL}/signin?error=google_failed&details=${encodeURIComponent(err.message || 'unknown')}`);
    }
};

module.exports = { googleCallback };