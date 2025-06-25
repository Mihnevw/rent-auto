const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    '1_3': { type: Number, required: true },
    '4_7': { type: Number, required: true },
    '8_14': { type: Number, required: true },
    '15_plus': { type: Number, required: true }
}, { _id: false });

const carSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    name: { type: String, required: true },
    mainImage: { type: String, required: true },
    thumbnails: [{ type: String }],
    engine: { type: String, required: true },
    fuel: { type: String, required: true },
    transmission: { type: String, enum: ['automatic', 'manual'], required: true },
    seats: { type: String, required: true },
    doors: { type: String, required: true },
    year: { type: String, required: true },
    consumption: { type: String, required: true },
    bodyType: { type: String, required: true },
    priceIncludes: [{ type: String }],
    features: [{ type: String }],
    pricing: { type: pricingSchema, required: true },
    currentLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
