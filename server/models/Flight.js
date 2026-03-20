const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: { type: String, required: true },
    alliance: String,
    flightNumber: String,
    aircraft: String,
    cabin: { type: String, enum: ['economy', 'premium_economy', 'business', 'first'] },
    origin: {
        airport: String,
        city: String,
        code: String,
    },
    destination: {
        airport: String,
        city: String,
        code: String,
    },
    departureTime: Date,
    arrivalTime: Date,
    duration: Number,
    stops: [{
        airport: String,
        duration: Number,
    }],
    price: { type: Number, required: true },
    baggagePerPax: String,
    flightQuality: { type: Number, min: 0, max: 10 },
    bookingSites: [{
        name: String,
        url: String,
        price: Number,
    }],
    totalSeats: { type: Number, default: 180 },
    bookedSeats: { type: Number, default: 0 },
}, { timestamps: true });

flightSchema.virtual('availableSeats').get(function () {
    return this.totalSeats - this.bookedSeats;
});

module.exports = mongoose.model('Flight', flightSchema);