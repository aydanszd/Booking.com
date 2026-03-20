const Flight = require('../models/Flight');

exports.getFlights = async (req, res) => {
    try {
        const {
            origin, destination, airline, cabin,
            minPrice, maxPrice, stops, page = 1, limit = 10
        } = req.query;
        const filter = {};

        if (origin) filter['origin.city'] = new RegExp(origin, 'i');
        if (destination) filter['destination.city'] = new RegExp(destination, 'i');
        if (airline) filter.airline = new RegExp(airline, 'i');
        if (cabin) filter.cabin = cabin;
        if (stops === '0') filter['stops.0'] = { $exists: false };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const total = await Flight.countDocuments(filter);
        const flights = await Flight.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ price: 1 });

        res.json({ total, page: Number(page), flights });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFlight = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) return res.status(404).json({ message: 'Tapılmadı' });
        res.json(flight);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createFlight = async (req, res) => {
    try {
        const body = { ...req.body };
        if (typeof body.stops === 'string') body.stops = JSON.parse(body.stops);
        if (typeof body.bookingSites === 'string') body.bookingSites = JSON.parse(body.bookingSites);

        const flight = await Flight.create(body);
        res.status(201).json(flight);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateFlight = async (req, res) => {
    try {
        const body = { ...req.body };
        if (typeof body.stops === 'string') body.stops = JSON.parse(body.stops);
        if (typeof body.bookingSites === 'string') body.bookingSites = JSON.parse(body.bookingSites);

        const flight = await Flight.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!flight) return res.status(404).json({ message: 'Tapılmadı' });
        res.json(flight);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);
        if (!flight) return res.status(404).json({ message: 'Tapılmadı' });
        res.json({ message: 'Silindi' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};