const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    images:      { type: [String], default: [] },
    country:     { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
