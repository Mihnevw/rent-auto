const Reservation = require('../models/reservationModel');

function generateReservationCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Minimum time between reservations in minutes
const MINIMUM_TIME_BETWEEN_RESERVATIONS = 120; // 2 hours

// Helper function to convert date and time to Date object
function convertToDateTime(date, time) {
    const [hours, minutes] = time.split(':');
    const [year, month, day] = date.split('-');
    return new Date(year, month - 1, day, hours, minutes);
}

// Helper function to check if there's enough time between reservations
function hasEnoughTimeBetweenReservations(endDateTime, nextStartDateTime) {
    const timeDifference = nextStartDateTime - endDateTime;
    const minimumTime = MINIMUM_TIME_BETWEEN_RESERVATIONS * 60 * 1000; // Convert to milliseconds
    return timeDifference >= minimumTime;
}

async function isCarAvailable(carId, fromDateTime, toDateTime) {
    // Find all reservations for this car that might conflict
    const reservations = await Reservation.find({
        carId,
        $or: [
            // Direct time overlap
            {
                fromDateTime: { $lt: toDateTime },
                toDateTime: { $gt: fromDateTime }
            },
            // Check for minimum gap before this reservation
            {
                fromDateTime: {
                    $gt: fromDateTime,
                    $lt: new Date(new Date(toDateTime).getTime() + MINIMUM_TIME_BETWEEN_RESERVATIONS * 60 * 1000)
                }
            },
            // Check for minimum gap after this reservation
            {
                toDateTime: {
                    $lt: toDateTime,
                    $gt: new Date(new Date(fromDateTime).getTime() - MINIMUM_TIME_BETWEEN_RESERVATIONS * 60 * 1000)
                }
            }
        ]
    }).sort({ fromDateTime: 1 });

    // If no overlapping reservations found, the car is available
    return reservations.length === 0;
}

async function addReservation(reservationData) {
    // Check if the car is available for the time period only
    const isAvailable = await isCarAvailable(
        reservationData.carId,
        reservationData.fromDateTime,
        reservationData.toDateTime
    );

    if (!isAvailable) {
        throw new Error('Car is not available for the selected time period');
    }

    const code = generateReservationCode();
    reservationData.code = code;
    const reservation = new Reservation(reservationData);
    const saved = await reservation.save();
    const populated = await saved.populate('carId fromPlace toPlace');
    
    const responseData = populated.toObject();
    delete responseData.code;
    return responseData;
}

async function getAllReservations() {
    return await Reservation.find().populate('carId fromPlace toPlace');
}

module.exports = {
    isCarAvailable,
    addReservation,
    getAllReservations,
    convertToDateTime
};