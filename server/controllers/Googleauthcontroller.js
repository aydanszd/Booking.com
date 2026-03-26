const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// GET /auth/google/callback — Passport uğurla qayıtdıqdan sonra işləyir
const googleCallback = async (req, res) => {
    try {
        const { id, name, email, avatar } = req.user;

        console.log('\n🔍 GOOGLE CALLBACK BAŞLADI:');
        console.log('   id     :', id);
        console.log('   name   :', name);
        console.log('   email  :', email);
        console.log('   avatar :', avatar);

        // DB-də user tap — həm googleId həm email ilə axtar
        let user = await User.findOne({ 
            $or: [{ googleId: id }, { email }]
        });

        console.log('   DB axtarış nəticəsi:', user ? `✅ TAPILDI — ${user.email} (${user._id})` : '❌ TAPILMADI');

        if (!user) {
            console.log('🆕 YENİ İSTİFADƏÇİ YARADILIR...');
            try {
                user = await User.create({
                    name,
                    email,
                    avatar,
                    googleId: id,
                    password: null,
                });
                console.log('✅ YENİ İSTİFADƏÇİ YARADILDI:', user._id, user.email);
            } catch (createErr) {
                console.error('❌ CREATE XƏTASI:', createErr.message);
                throw createErr;
            }
        } else {
            console.log('👤 MÖVCUD İSTİFADƏÇİ YENİLƏNİR...');
            if (!user.googleId) user.googleId = id;
            if (!user.avatar)   user.avatar   = avatar;
            await user.save();
            console.log('✅ YENİLƏNDİ:', user._id, user.role);
        }

        // JWT yarat
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Token-i cookie-yə yaz
        res.cookie('token', token, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === 'production',
            maxAge:   7 * 24 * 60 * 60 * 1000,
        });

        // localStorage üçün user məlumatını URL-ə əlavə et
        const userData = encodeURIComponent(JSON.stringify({
            _id:    user._id,
            name:   user.name,
            email:  user.email,
            role:   user.role,
            avatar: user.avatar,
        }));

        console.log(`\n✅ UĞURLU GOOGLE GİRİŞİ: ${user.name} (${user.email}) — rol: ${user.role}`);

        res.redirect(`${process.env.CLIENT_URL}/?google_user=${encodeURIComponent(user.name)}&token=${token}&user=${userData}`);

    } catch (err) {
        require('fs').writeFileSync('debug_error.txt', err.stack || err.toString());
        console.error('\n🔴 GOOGLE CALLBACK DB / JWT XƏTASI:', err);
        res.redirect(`${process.env.CLIENT_URL}/signin?error=google_failed&details=${encodeURIComponent(err.message || 'unknown')}`);
    }
};

module.exports = { googleCallback };