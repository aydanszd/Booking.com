const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const Destination = require('../models/Destination');

// GET all
router.get('/', async (req, res) => {
    try {
        const destinations = await Destination.find().sort({ createdAt: -1 });
        res.json({ destinations, total: destinations.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single
router.get('/:id', async (req, res) => {
    try {
        const dest = await Destination.findById(req.params.id);
        if (!dest) return res.status(404).json({ message: 'Tapılmadı' });
        res.json(dest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create
router.post('/', upload.array('images', 3), async (req, res) => {
    try {
        const { name, description, country, imageUrls } = req.body;
        const uploaded = (req.files || []).map(f => `/uploads/${f.filename}`);
        const urlList = imageUrls
            ? (Array.isArray(imageUrls) ? imageUrls : JSON.parse(imageUrls)).filter(Boolean)
            : [];
        const images = [...uploaded, ...urlList].slice(0, 3);
        const dest = await Destination.create({ name, description, country, images });
        res.status(201).json(dest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update
router.put('/:id', upload.array('images', 3), async (req, res) => {
    try {
        const { name, description, country, imageUrls, keepImages } = req.body;
        const dest = await Destination.findById(req.params.id);
        if (!dest) return res.status(404).json({ message: 'Tapılmadı' });

        const kept = keepImages
            ? (Array.isArray(keepImages) ? keepImages : JSON.parse(keepImages))
            : [];
        const uploaded = (req.files || []).map(f => `/uploads/${f.filename}`);
        const urlList = imageUrls
            ? (Array.isArray(imageUrls) ? imageUrls : JSON.parse(imageUrls)).filter(Boolean)
            : [];
        const images = [...kept, ...uploaded, ...urlList].slice(0, 3);

        dest.name = name ?? dest.name;
        dest.description = description ?? dest.description;
        dest.country = country ?? dest.country;
        dest.images = images;
        await dest.save();
        res.json(dest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Destination.findByIdAndDelete(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
