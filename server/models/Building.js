const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, min: 0, max: 10 },
    comment: String,
}, { timestamps: true });

const roomSchema = new mongoose.Schema({
    bedrooms: Number,
    bathrooms: Number,
    maxGuests: Number,
});

const bookedDateSchema = new mongoose.Schema({
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
});

const buildingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['hotel', 'apartment', 'villa', 'hostel', 'resort'], required: true },
    brand: String,
    location: {
        address: String,
        city: { type: String, required: true },
        country: { type: String, required: true },
        coords: { lat: Number, lng: Number },
    },
    pricePerNight: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 10 },
    images: [String],
    amenities: [String],
    rooms: roomSchema,
    travelGroups: [{ type: String, enum: ['solo', 'couple', 'family', 'group', 'business'] }],
    reviews: [reviewSchema],
    bookedDates: [bookedDateSchema],
    isAvailable: { type: Boolean, default: true },
    minNights: { type: Number, default: 1 },
    maxGuests: { type: Number, default: 10 },
}, { timestamps: true });

buildingSchema.methods.isDateAvailable = function (checkIn, checkOut) {
    const newIn = new Date(checkIn);
    const newOut = new Date(checkOut);
    return !this.bookedDates.some(({ checkIn: bIn, checkOut: bOut }) => {
        return newIn < bOut && newOut > bIn;
    });
};

module.exports = mongoose.model('Building', buildingSchema);