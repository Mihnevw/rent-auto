const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    fromTime: { type: String, required: true },
    toTime: { type: String, required: true },
    fromPlace: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    toPlace: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    fromDateTime: { type: String, required: true },
    toDateTime: { type: String, required: true },
    code: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentIntentId: { type: String },
    totalAmount: { type: Number, required: true }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;