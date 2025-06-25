const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    isActive: { type: Boolean, default: true }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location; 