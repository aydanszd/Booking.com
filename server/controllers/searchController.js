const Building = require('../models/Building');
const Car = require('../models/Car');
const Flight = require('../models/Flight');

exports.globalSearch = async (req, res, next) => {
    try {
        const { q, type, page = 1, limit = 10 } = req.query;
        if (!q) return res.status(400).json({ message: 'Axtarış sorğusu boşdur' });

        const regex = new RegExp(q, 'i');
        const skip = (page - 1) * limit;
        const results = {};

        if (!type || type === 'building') {
            results.buildings = await Building.find({
                $or: [
                    { title: regex },
                    { 'location.city': regex },
                    { 'location.country': regex },
                    { brand: regex },
                    { type: regex },
                ],
            }).skip(skip).limit(Number(limit)).select('title type location pricePerNight rating images');
        }

        if (!type || type === 'car') {
            results.cars = await Car.find({
                $or: [
                    { title: regex },
                    { brand: regex },
                    { model: regex },
                    { category: regex },
                    { 'location.city': regex },
                ],
            }).skip(skip).limit(Number(limit)).select('title brand model category pricePerDay rating images');
        }

        if (!type || type === 'flight') {
            results.flights = await Flight.find({
                $or: [
                    { airline: regex },
                    { 'origin.city': regex },
                    { 'destination.city': regex },
                    { 'origin.code': regex },
                    { 'destination.code': regex },
                ],
            }).skip(skip).limit(Number(limit)).select('airline origin destination price cabin departureTime');
        }

        res.json(results);
    } catch (err) { next(err); }
};

exports.filterBuildings = async (req, res, next) => {
    try {
        const {
            city, country, type, brand,
            minPrice, maxPrice, minRating,
            travelGroup, amenities,
            bedrooms, bathrooms,
            sortBy = 'createdAt', order = 'desc',
            page = 1, limit = 10,
        } = req.query;

        const filter = {};
        if (city) filter['location.city'] = new RegExp(city, 'i');
        if (country) filter['location.country'] = new RegExp(country, 'i');
        if (type) filter.type = type;
        if (brand) filter.brand = new RegExp(brand, 'i');
        if (minRating) filter.rating = { $gte: Number(minRating) };
        if (travelGroup) filter.travelGroups = travelGroup;
        if (bedrooms) filter['rooms.bedrooms'] = { $gte: Number(bedrooms) };
        if (bathrooms) filter['rooms.bathrooms'] = { $gte: Number(bathrooms) };
        if (amenities) filter.amenities = { $all: amenities.split(',') };

        if (minPrice || maxPrice) {
            filter.pricePerNight = {};
            if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
        }

        const sort = { [sortBy]: order === 'desc' ? -1 : 1 };
        const total = await Building.countDocuments(filter);
        const data = await Building.find(filter).sort(sort).skip((page - 1) * limit).limit(Number(limit));

        res.json({ total, page: Number(page), data });
    } catch (err) { next(err); }
};

exports.filterCars = async (req, res, next) => {
    try {
        const {
            city, category, transmission,
            minPrice, maxPrice, minSeats,
            minRating, features,
            sortBy = 'pricePerDay', order = 'asc',
            page = 1, limit = 10,
        } = req.query;

        const filter = {};
        if (city) filter['location.city'] = new RegExp(city, 'i');
        if (category) filter.category = category;
        if (transmission) filter.transmission = transmission;
        if (minSeats) filter.seats = { $gte: Number(minSeats) };
        if (minRating) filter.rating = { $gte: Number(minRating) };
        if (features) filter.features = { $all: features.split(',') };

        if (minPrice || maxPrice) {
            filter.pricePerDay = {};
            if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
        }

        const sort = { [sortBy]: order === 'desc' ? -1 : 1 };
        const total = await Car.countDocuments(filter);
        const data = await Car.find(filter).sort(sort).skip((page - 1) * limit).limit(Number(limit));

        res.json({ total, page: Number(page), data });
    } catch (err) { next(err); }
};

exports.filterFlights = async (req, res, next) => {
    try {
        const {
            origin, destination,
            airline, cabin, alliance,
            minPrice, maxPrice,
            directOnly, maxDuration,
            sortBy = 'price', order = 'asc',
            page = 1, limit = 10,
        } = req.query;

        const filter = {};
        if (origin) filter['origin.city'] = new RegExp(origin, 'i');
        if (destination) filter['destination.city'] = new RegExp(destination, 'i');
        if (airline) filter.airline = new RegExp(airline, 'i');
        if (cabin) filter.cabin = cabin;
        if (alliance) filter.alliance = new RegExp(alliance, 'i');
        if (directOnly === 'true') filter['stops.0'] = { $exists: false };
        if (maxDuration) filter.duration = { $lte: Number(maxDuration) };

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const sort = { [sortBy]: order === 'desc' ? -1 : 1 };
        const total = await Flight.countDocuments(filter);
        const data = await Flight.find(filter).sort(sort).skip((page - 1) * limit).limit(Number(limit));

        res.json({ total, page: Number(page), data });
    } catch (err) { next(err); }
};