const Car = require('../models/Car');

exports.getCars = async (req, res) => {
    try {
        const { city, category, transmission, minPrice, maxPrice, seats, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (city) filter['location.city'] = new RegExp(city, 'i');
        if (category) filter.category = category;
        if (transmission) filter.transmission = transmission;
        if (seats) filter.seats = { $gte: Number(seats) };
        if (minPrice || maxPrice) {
            filter.pricePerDay = {};
            if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
        }

        const total = await Car.countDocuments(filter);
        const cars = await Car.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.json({ total, page: Number(page), cars });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Tapılmadı' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCar = async (req, res) => {
    try {
        const images = req.files?.map(f => `/uploads/${f.filename}`) || [];
        const body = { ...req.body };
        if (typeof body.location === 'string') body.location = JSON.parse(body.location);
        if (typeof body.features === 'string') body.features = JSON.parse(body.features);

        const car = await Car.create({ ...body, images });
        res.status(201).json(car);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const images = req.files?.map(f => `/uploads/${f.filename}`);
        const body = { ...req.body };
        if (typeof body.location === 'string') body.location = JSON.parse(body.location);
        if (typeof body.features === 'string') body.features = JSON.parse(body.features);
        if (images?.length) body.images = images;

        const car = await Car.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!car) return res.status(404).json({ message: 'Tapılmadı' });
        res.json(car);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) return res.status(404).json({ message: 'Tapılmadı' });
        res.json({ message: 'Silindi' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Tapılmadı' });

        car.reviews.push({
            userId: req.user._id,
            userName: req.user.name,
            score: req.body.score,
            comment: req.body.comment,
        });
        const avg = car.reviews.reduce((s, r) => s + r.score, 0) / car.reviews.length;
        car.rating = Math.round(avg * 10) / 10;

        await car.save();
        res.json(car);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST /api/cars/:id/review/:reviewId/reply
exports.replyToReview = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Tapılmadı' });

        const review = car.reviews.id(req.params.reviewId);
        if (!review) return res.status(404).json({ message: 'Rəy tapılmadı' });

        review.adminReply = req.body.reply;
        review.adminReplyAt = new Date();

        await car.save();
        res.json(car);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};