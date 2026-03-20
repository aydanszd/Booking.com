const mongoose = require('mongoose');

const bookedDateSchema = new mongoose.Schema({
    pickUp: { type: Date, required: true },
    dropOff: { type: Date, required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
});

const carSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['economy', 'compact', 'suv', 'luxury', 'van', 'electric'] },
    brand: String,
    model: String,
    supplier: String,
    location: {
        city: String,
        country: String,
        coords: { lat: Number, lng: Number },
    },
    transmission: { type: String, enum: ['manual', 'automatic'] },
    seats: Number,
    mileage: Number,
    pricePerDay: { type: Number, required: true },
    images: [String],
    features: [String],
    rating: { type: Number, default: 0, min: 0, max: 10 },
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: Number,
        comment: String,
    }],
    bookedDates: [bookedDateSchema],
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

carSchema.methods.isDateAvailable = function (pickUp, dropOff) {
    const newIn = new Date(pickUp);
    const newOut = new Date(dropOff);
    return !this.bookedDates.some(({ pickUp: bIn, dropOff: bOut }) => {
        return newIn < bOut && newOut > bIn;
    });
};

module.exports = mongoose.model('Car', carSchema);