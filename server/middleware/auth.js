const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token yoxdur' });
        }

        const token = header.split(' ')[1];
        const decoded = verifyToken(token);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'İstifadəçi tapılmadı' });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token etibarsızdır' });
    }
};

exports.adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin icazəsi lazımdır' });
    }
    next();
};