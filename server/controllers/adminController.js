const User = require('../models/User');
const Building = require('../models/Building');
const Car = require('../models/Car');

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort('-createdAt');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/admin/reviews
exports.getAllReviews = async (req, res) => {
    try {
        const buildings = await Building.find({ 'reviews.0': { $exists: true } }, 'title reviews');
        const cars = await Car.find({ 'reviews.0': { $exists: true } }, 'title reviews');

        const reviews = [];

        buildings.forEach(b => {
            b.reviews.forEach(r => {
                reviews.push({
                    _id: r._id,
                    resourceId: b._id,
                    resourceTitle: b.title,
                    resourceType: 'hotel',
                    userName: r.userName || 'Guest',
                    score: r.score,
                    comment: r.comment,
                    adminReply: r.adminReply,
                    adminReplyAt: r.adminReplyAt,
                    createdAt: r.createdAt,
                });
            });
        });

        cars.forEach(c => {
            c.reviews.forEach(r => {
                reviews.push({
                    _id: r._id,
                    resourceId: c._id,
                    resourceTitle: c.title,
                    resourceType: 'car',
                    userName: r.userName || 'Guest',
                    score: r.score,
                    comment: r.comment,
                    adminReply: r.adminReply,
                    adminReplyAt: r.adminReplyAt,
                    createdAt: r.createdAt,
                });
            });
        });

        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Yanlış rol" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

        res.json({ message: "Rol uğurla yeniləndi", user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
