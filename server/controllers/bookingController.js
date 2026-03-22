const Booking = require('../models/Booking');
const Building = require('../models/Building');
const Car = require('../models/Car');
const Flight = require('../models/Flight');

exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('building', 'title images location pricePerNight')
            .populate('car', 'title images brand model pricePerDay')
            .populate('flight', 'airline origin destination departureTime price')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) { next(err); }
};

exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
            .populate('building')
            .populate('car')
            .populate('flight');
        if (!booking) return res.status(404).json({ message: 'Rezervasiya tapılmadı' });
        res.json(booking);
    } catch (err) { next(err); }
};

exports.createBooking = async (req, res, next) => {
    try {
        const {
            type, building: buildingId, car: carId, flight: flightId,
            checkIn, checkOut, pickUp, dropOff,
            guests, passengers, totalPrice, contactInfo, notes,
        } = req.body;

        // --- Building yoxlama ---
        if (type === 'building') {
            const building = await Building.findById(buildingId);
            if (!building) return res.status(404).json({ message: 'Otel tapılmadı' });
            if (!building.isAvailable) return res.status(400).json({ message: 'Otel mövcud deyil' });
            if (!building.isDateAvailable(checkIn, checkOut)) {
                return res.status(400).json({ message: 'Bu tarixlər artıq rezervasiya olunub' });
            }
        }

        // --- Car yoxlama ---
        if (type === 'car') {
            const car = await Car.findById(carId);
            if (!car) return res.status(404).json({ message: 'Avtomobil tapılmadı' });
            if (!car.isAvailable) return res.status(400).json({ message: 'Avtomobil mövcud deyil' });
            if (!car.isDateAvailable(pickUp, dropOff)) {
                return res.status(400).json({ message: 'Bu tarixlər artıq rezervasiya olunub' });
            }
        }

        // --- Flight yoxlama ---
        if (type === 'flight') {
            const flight = await Flight.findById(flightId);
            if (!flight) return res.status(404).json({ message: 'Uçuş tapılmadı' });
            if (flight.bookedSeats + (passengers || 1) > flight.totalSeats) {
                return res.status(400).json({ message: 'Kifayət qədər yer yoxdur' });
            }
        }

        // Rezervasiya yarat
        const booking = await Booking.create({
            user: req.user._id,
            type,
            building: buildingId,
            car: carId,
            flight: flightId,
            checkIn, checkOut,
            pickUp, dropOff,
            guests, passengers,
            totalPrice, contactInfo, notes,
        });

        // Building bookedDates yenilə
        if (type === 'building') {
            await Building.findByIdAndUpdate(buildingId, {
                $push: { bookedDates: { checkIn, checkOut, bookingId: booking._id } },
            });
        }

        // Car bookedDates yenilə
        if (type === 'car') {
            await Car.findByIdAndUpdate(carId, {
                $push: { bookedDates: { pickUp, dropOff, bookingId: booking._id } },
            });
        }

        // Flight bookedSeats yenilə
        if (type === 'flight') {
            await Flight.findByIdAndUpdate(flightId, {
                $inc: { bookedSeats: passengers || 1 },
            });
        }

        res.status(201).json(booking);
    } catch (err) { next(err); }
};

exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
        if (!booking) return res.status(404).json({ message: 'Tapılmadı' });
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Artıq ləğv edilib' });
        }

        booking.status = 'cancelled';
        await booking.save();

        if (booking.type === 'building' && booking.building) {
            await Building.findByIdAndUpdate(booking.building, {
                $pull: { bookedDates: { bookingId: booking._id } },
            });
        }

        if (booking.type === 'car' && booking.car) {
            await Car.findByIdAndUpdate(booking.car, {
                $pull: { bookedDates: { bookingId: booking._id } },
            });
        }

        if (booking.type === 'flight' && booking.flight) {
            await Flight.findByIdAndUpdate(booking.flight, {
                $inc: { bookedSeats: -(booking.passengers || 1) },
            });
        }

        res.json(booking);
    } catch (err) { next(err); }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const { status, type, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const total = await Booking.countDocuments(filter);
        const bookings = await Booking.find(filter)
            .populate('user', 'name email')
            .populate('building', 'title')
            .populate('car', 'title brand')
            .populate('flight', 'airline flightNumber')
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.json({ total, page: Number(page), bookings });
    } catch (err) { next(err); }
};