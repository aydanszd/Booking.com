const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['building', 'car', 'flight'],
        required: true,
    },
    building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },

    checkIn: Date,
    checkOut: Date,
    pickUp: Date,
    dropOff: Date,

    guests: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 },
    },
    passengers: { type: Number, default: 1 },

    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    },
    contactInfo: {
        fullName: String,
        email: String,
        phone: String,
    },
    notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);