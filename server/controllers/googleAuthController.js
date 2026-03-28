const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const logger = require('../config/logger');

// GET /auth/google/callback — Passport uğurla qayıtdıqdan sonra işləyir
const googleCallback = async (req, res) => {
    try {
        const { id, name, email, avatar } = req.user;

        logger.info('Google callback başladı', { id, name, email });

        // DB-də user tap — həm googleId həm email ilə axtar
        let user = await User.findOne({
            $or: [{ googleId: id }, { email }]
        });

        if (user) {
            logger.info(`Mövcud user tapıldı: ${user.email} (${user._id})`);
            if (!user.googleId) user.googleId = id;
            if (!user.avatar)   user.avatar   = avatar;
            await user.save();
            logger.debug(`User yeniləndi — rol: ${user.role}`);
        } else {
            logger.info(`Yeni user yaradılır: ${email}`);
            user = await User.create({ name, email, avatar, googleId: id, password: null });
            logger.info(`Yeni user yaradıldı: ${user._id} — ${user.email}`);
        }

        // JWT yarat
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === 'production',
            maxAge:   7 * 24 * 60 * 60 * 1000,
        });

        const userData = encodeURIComponent(JSON.stringify({
            _id:    user._id,
            name:   user.name,
            email:  user.email,
            role:   user.role,
            avatar: user.avatar,
        }));

        logger.info(`Uğurlu Google girişi: ${user.name} (${user.email}) — rol: ${user.role}`);

        res.redirect(
            `${process.env.CLIENT_URL}/?google_user=${encodeURIComponent(user.name)}&token=${token}&user=${userData}`
        );

    } catch (err) {
        logger.error('Google callback xətası', { error: err.message, stack: err.stack });
        res.redirect(
            `${process.env.CLIENT_URL}/signin?error=google_failed&details=${encodeURIComponent(err.message || 'unknown')}`
        );
    }
};

module.exports = { googleCallback };
