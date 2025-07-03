const mongoose = require('mongoose');

const pendingReservationSchema = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    fromDate: {
        type: String,
        required: true
    },
    toDate: {
        type: String,
        required: true
    },
    fromTime: {
        type: String,
        required: true
    },
    toTime: {
        type: String,
        required: true
    },
    fromPlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    toPlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    fromDateTime: {
        type: String,
        required: true
    },
    toDateTime: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentIntentId: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Document will be automatically deleted when expiresAt is reached
    }
}, {
    timestamps: true
});

// Create indexes
pendingReservationSchema.index({ paymentIntentId: 1 });
pendingReservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingReservation = mongoose.model('PendingReservation', pendingReservationSchema);

module.exports = PendingReservation; 