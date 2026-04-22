const Booking = require('../models/Booking');
const Building = require('../models/Building');
const Car = require('../models/Car');
const Flight = require('../models/Flight');

exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            // populate — yalnız ID saxlamaq əvəzinə əlaqəli sənədin
            // seçilmiş sahələrini birbaşa bu sorğuda gətirir (JOIN-in MongoDB qarşılığı)
            .populate('building', 'title images location pricePerNight rating')
            .populate('car', 'title images brand model pricePerDay location rating')
            .populate('flight', 'airline origin destination departureTime arrivalTime price logoUrl flightNumber')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) { next(err); }
};

exports.getBooking = async (req, res, next) => {
    try {
        // user: req.user._id şərti — başqasının rezervasiyasına girişi bloklayır
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

        // ── Mövcudluq yoxlaması ──────────────────────────────────────────────
        // Hər tip üçün ayrı yoxlama lazımdır çünki:
        // - Building və Car tarix üst-üstə düşməsini yoxlayır (isDateAvailable)
        // - Flight isə yer sayını yoxlayır (bookedSeats + yeni < totalSeats)
        // Qeyd: burada race condition riski var — eyni anda 2 sorğu gəlsə
        // hər ikisi "boşdur" görüb keçə bilər. Həll üçün MongoDB transaction lazımdır.

        if (type === 'building') {
            const building = await Building.findById(buildingId);
            if (!building) return res.status(404).json({ message: 'Otel tapılmadı' });
            if (!building.isAvailable) return res.status(400).json({ message: 'Otel mövcud deyil' });
            if (!building.isDateAvailable(checkIn, checkOut)) {
                return res.status(400).json({ message: 'Bu tarixlər artıq rezervasiya olunub' });
            }
        }

        if (type === 'car') {
            const car = await Car.findById(carId);
            if (!car) return res.status(404).json({ message: 'Avtomobil tapılmadı' });
            if (!car.isAvailable) return res.status(400).json({ message: 'Avtomobil mövcud deyil' });
            if (!car.isDateAvailable(pickUp, dropOff)) {
                return res.status(400).json({ message: 'Bu tarixlər artıq rezervasiya olunub' });
            }
        }

        if (type === 'flight') {
            const flight = await Flight.findById(flightId);
            if (!flight) return res.status(404).json({ message: 'Uçuş tapılmadı' });
            if (flight.bookedSeats + (passengers || 1) > flight.totalSeats) {
                return res.status(400).json({ message: 'Kifayət qədər yer yoxdur' });
            }
        }

        // Ümumi qiymətin 30%-i depozit kimi hesablanır
        const paidAmount = Math.ceil((totalPrice || 0) * 0.3);

        const booking = await Booking.create({
            user: req.user._id,
            type,
            building: buildingId,
            car: carId,
            flight: flightId,
            checkIn, checkOut,
            pickUp, dropOff,
            guests, passengers,
            totalPrice, paidAmount, contactInfo, notes,
        });

        // ── Resurs vəziyyətini yenilə ────────────────────────────────────────
        // Booking yaradıldıqdan sonra müvafiq resursun məlumatı yenilənir.
        // $push — massivə yeni element əlavə edir (bookedDates)
        // $inc  — rəqəmsal sahəni artırır (bookedSeats)

        if (type === 'building') {
            await Building.findByIdAndUpdate(buildingId, {
                $push: { bookedDates: { checkIn, checkOut, bookingId: booking._id } },
            });
        }

        if (type === 'car') {
            await Car.findByIdAndUpdate(carId, {
                $push: { bookedDates: { pickUp, dropOff, bookingId: booking._id } },
            });
        }

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
        // Admin istənilən rezervasiyanı ləğv edə bilər,
        // adi user yalnız özününkünü — query şərtlə təmin edilir
        const isAdmin = req.user?.role === 'admin';
        const query = isAdmin
            ? { _id: req.params.id }
            : { _id: req.params.id, user: req.user._id };

        const booking = await Booking.findOne(query);
        if (!booking) return res.status(404).json({ message: 'Tapılmadı' });
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Artıq ləğv edilib' });
        }

        booking.status = 'cancelled';
        await booking.save();

        // ── Tutulmuş tarixi/yeri geri qaytar ────────────────────────────────
        // Ləğv olunanda resursun məlumatı da geri alınır ki,
        // həmin tarix/yer yenidən başqasına görünsün.
        // $pull — massivdən şərtə uyğun elementi silir
        // $inc mənfi dəyərlə — bookedSeats-i azaldır

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

exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: 'Yanlış status dəyəri' });
        }

        const existing = await Booking.findById(req.params.id);
        if (!existing) return res.status(404).json({ message: 'Rezervasiya tapılmadı' });

        // Status 'cancelled'-a keçirsə və əvvəlcədən cancelled deyilsə —
        // tutulmuş tarixlər/yerlər geri qaytarılır (cancelBooking ilə eyni məntiq)
        if (status === 'cancelled' && existing.status !== 'cancelled') {
            if (existing.type === 'building' && existing.building) {
                await Building.findByIdAndUpdate(existing.building, {
                    $pull: { bookedDates: { bookingId: existing._id } },
                });
            }
            if (existing.type === 'car' && existing.car) {
                await Car.findByIdAndUpdate(existing.car, {
                    $pull: { bookedDates: { bookingId: existing._id } },
                });
            }
            if (existing.type === 'flight' && existing.flight) {
                await Flight.findByIdAndUpdate(existing.flight, {
                    $inc: { bookedSeats: -(existing.passengers || 1) },
                });
            }
        }

        existing.status = status;
        await existing.save();

        // Yenilənmiş booking-i populate ilə tam məlumatla qaytar
        const booking = await Booking.findById(existing._id)
            .populate('user', 'name email')
            .populate('building', 'title')
            .populate('car', 'title brand')
            .populate('flight', 'airline flightNumber');

        res.json(booking);
    } catch (err) { next(err); }
};

exports.confirmBooking = async (req, res, next) => {
    try {
        const { status, paidAmount, paymentIntentId } = req.body;

        // user: req.user._id şərti — yalnız öz rezervasiyasını təsdiq edə bilər
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!booking) return res.status(404).json({ message: 'Rezervasiya tapılmadı' });
        // İdempotent davranış — artıq təsdiqlənibsə eyni cavabı qaytar
        if (booking.status === 'confirmed') return res.json(booking);

        booking.status = status || 'confirmed';
        if (paidAmount) booking.paidAmount = paidAmount;
        if (paymentIntentId) booking.notes = `paymentIntentId:${paymentIntentId}`;
        await booking.save();

        res.json(booking);
    } catch (err) { next(err); }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const { status, type, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        // countDocuments filter ilə işləyir — pagination üçün ümumi say lazımdır
        const total = await Booking.countDocuments(filter);
        const bookings = await Booking.find(filter)
            .populate('user', 'name email')
            .populate('building', 'title')
            .populate('car', 'title brand')
            .populate('flight', 'airline flightNumber')
            // skip — neçə sənəd atlansın (page 2 → 20 atla)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.json({ total, page: Number(page), bookings });
    } catch (err) { next(err); }
};
