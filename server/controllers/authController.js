const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Bu email artıq istifadə olunur' });

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.status(201).json({ user, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ message: 'Email və ya şifrə yanlışdır' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Email və ya şifrə yanlışdır' });

        const token = generateToken(user._id);
        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
    res.json(req.user);
};

// PUT /api/auth/me
exports.updateMe = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, avatar },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // ── DEBUG ──────────────────────────────────────────
        console.log('\n📧 FORGOT PASSWORD İSTƏYİ:');
        console.log('   Axtarılan email :', email);
        console.log('   SMTP_EMAIL      :', process.env.SMTP_EMAIL   || '❌ yoxdur');
        console.log('   SMTP_PASSWORD   :', process.env.SMTP_PASSWORD ? '✅ var' : '❌ yoxdur');
        console.log('   CLIENT_URL      :', process.env.CLIENT_URL   || '❌ yoxdur');
        // ───────────────────────────────────────────────────

        const user = await User.findOne({ email });

        console.log('   Tapılan user    :', user ? `✅ ${user.email}` : '❌ tapılmadı');

        if (!user) {
            return res.status(404).json({ message: "Bu email ilə istifadəçi tapılmadı" });
        }

        // Token yarat
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 dəqiqə
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        console.log('   Reset URL       :', resetUrl);

        const message = `Şifrənizi sıfırlamaq üçün bu linkə daxil olun: ${resetUrl}\n\nBu link 10 dəqiqə ərzində etibarlıdır.`;

        try {
            console.log('\n📨 Email göndərilir...');
            await sendEmail({
                email: user.email,
                subject: 'Şifrə Sıfırlama Tokeni',
                message,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px;">
                        <h2 style="color: #003580;">Booking.com Şifrə Sıfırlama</h2>
                        <p>Şifrənizi sıfırlamaq üçün aşağıdakı düyməyə basın:</p>
                        <a href="${resetUrl}" style="background-color: #003580; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Şifrəni Sıfırla</a>
                        <p style="margin-top: 15px; color: #555;">Bu link <strong>10 dəqiqə</strong> ərzində etibarlıdır.</p>
                        <p style="font-size: 12px; color: #777; margin-top: 20px;">Əgər bu sorğunu siz etməmisinizsə, bu mesajı görməzdən gəlin.</p>
                        <hr />
                        <p style="font-size: 11px;">Hörmətlə, Booking App komandası.</p>
                    </div>
                `
            });
            console.log('✅ Email uğurla göndərildi!');
            res.json({ message: "Şifrə sıfırlama linki emailinizə göndərildi", resetUrl });

        } catch (err) {
            console.error('\n❌ EMAIL XƏTASI:');
            console.error('   Xəta növü :', err.code    || 'naməlum');
            console.error('   Mesaj     :', err.message);
            console.error('   Tam xəta  :', err);

            res.json({
                success: true,
                message: "Email göndərilə bilmədi. SMTP ayarlarını yoxlayın.",
                resetUrl,
                error: err.message
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Sıfırlama tokeni yanlışdır və ya vaxtı bitib" });
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();

        res.json({ message: "Şifrəniz uğurla yeniləndi" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};