const User = require('../models/User');
const { generateToken } = require('../config/jwt');

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