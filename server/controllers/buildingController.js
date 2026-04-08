const Building = require('../models/Building');

// GET /api/buildings
exports.getBuildings = async (req, res) => {
    try {
        const { city, type, minPrice, maxPrice, rating, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (city) filter['location.city'] = new RegExp(city, 'i');
        if (type) filter.type = type;
        if (rating) filter.rating = { $gte: Number(rating) };
        if (minPrice || maxPrice) {
            filter.pricePerNight = {};
            if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
        }

        const total = await Building.countDocuments(filter);
        const buildings = await Building.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.json({ total, page: Number(page), buildings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/buildings/:id
exports.getBuilding = async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) return res.status(404).json({ message: 'Tapılmadı' });
        res.json(building);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/buildings
exports.createBuilding = async (req, res) => {
    try {
        const uploadedImages = req.files?.map(f => `/uploads/${f.filename}`) || [];
        const body = { ...req.body };

        if (typeof body.location === 'string') body.location = JSON.parse(body.location);
        if (typeof body.rooms === 'string') body.rooms = JSON.parse(body.rooms);
        if (typeof body.amenities === 'string') body.amenities = JSON.parse(body.amenities);
        if (typeof body.travelGroups === 'string') body.travelGroups = JSON.parse(body.travelGroups);

        const urlImages = body.imageUrls ? JSON.parse(body.imageUrls) : [];
        delete body.imageUrls;
        const images = [...uploadedImages, ...urlImages];

        const building = await Building.create({ ...body, images });
        res.status(201).json(building);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateBuilding = async (req, res) => {
    try {
        const uploadedImages = req.files?.map(f => `/uploads/${f.filename}`) || [];
        const body = { ...req.body };

        if (typeof body.location === 'string') body.location = JSON.parse(body.location);
        if (typeof body.rooms === 'string') body.rooms = JSON.parse(body.rooms);
        if (typeof body.amenities === 'string') body.amenities = JSON.parse(body.amenities);
        if (typeof body.travelGroups === 'string') body.travelGroups = JSON.parse(body.travelGroups);

        const urlImages = body.imageUrls ? JSON.parse(body.imageUrls) : [];
        delete body.imageUrls;
        const allNew = [...uploadedImages, ...urlImages];
        if (allNew.length) body.images = allNew;

        const building = await Building.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!building) return res.status(404).json({ message: 'Tapılmadı' });
        res.json(building);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// DELETE /api/buildings/:id
exports.deleteBuilding = async (req, res) => {
    try {
        const building = await Building.findByIdAndDelete(req.params.id);
        if (!building) return res.status(404).json({ message: 'Tapılmadı' });
        res.json({ message: 'Silindi' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/buildings/:id/review
exports.addReview = async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) return res.status(404).json({ message: 'Tapılmadı' });

        building.reviews.push({
            userId: req.user._id,
            userName: req.user.name,
            score: req.body.score,
            comment: req.body.comment,
        });

        const avg = building.reviews.reduce((s, r) => s + r.score, 0) / building.reviews.length;
        building.rating = Math.round(avg * 10) / 10;

        await building.save();
        res.json(building);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST /api/buildings/:id/review/:reviewId/reply
exports.replyToReview = async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) return res.status(404).json({ message: 'Tapılmadı' });

        const review = building.reviews.id(req.params.reviewId);
        if (!review) return res.status(404).json({ message: 'Rəy tapılmadı' });

        review.adminReply = req.body.reply;
        review.adminReplyAt = new Date();

        await building.save();
        res.json(building);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};