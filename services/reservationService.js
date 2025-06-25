const Reservation = require('../models/reservationModel');
const { sendReservationConfirmation } = require('./emailService');

function generateReservationCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Минимално време между резервации в минути (за преместване на колата)
const MINIMUM_TIME_BETWEEN_RESERVATIONS = 120; // 2 часа

// Помощна функция за конвертиране на дата и час в Date обект
function convertToDateTime(date, time) {
    const [hours, minutes] = time.split(':');
    const [year, month, day] = date.split('-');
    return new Date(year, month - 1, day, hours, minutes);
}

// Помощна функция за проверка дали има достатъчно време между резервации
function hasEnoughTimeBetweenReservations(endDateTime, nextStartDateTime, sameLocation) {
    const timeDifference = nextStartDateTime - endDateTime;
    const minimumTime = sameLocation ? 0 : MINIMUM_TIME_BETWEEN_RESERVATIONS * 60 * 1000;
    return timeDifference >= minimumTime;
}

async function isCarAvailable(carId, fromDateTime, toDateTime, fromLocationId) {
    // Намираме всички резервации за тази кола
    const reservations = await Reservation.find({
        carId,
        $or: [
            // Резервации, които се припокриват с желания период
            {
                fromDateTime: { $lte: toDateTime },
                toDateTime: { $gte: fromDateTime }
            },
            // Резервации, които завършват преди желания период, но може да няма достатъчно време за преместване
            {
                toDateTime: { $lte: fromDateTime },
                toPlace: { $ne: fromLocationId }
            },
            // Резервации, които започват след желания период, но може да няма достатъчно време за преместване
            {
                fromDateTime: { $gte: toDateTime },
                fromPlace: { $ne: fromLocationId }
            }
        ]
    }).sort({ fromDateTime: 1 });

    if (reservations.length === 0) {
        return true;
    }

    // Проверяваме всяка резервация
    for (let i = 0; i < reservations.length; i++) {
        const currentReservation = reservations[i];
        
        // Проверка за директно припокриване
        if (currentReservation.fromDateTime <= toDateTime && currentReservation.toDateTime >= fromDateTime) {
            return false;
        }

        // Проверка за предходна резервация
        if (currentReservation.toDateTime <= fromDateTime) {
            const endDateTime = new Date(currentReservation.toDateTime);
            const nextStartDateTime = new Date(fromDateTime);
            const sameLocation = currentReservation.toPlace.toString() === fromLocationId.toString();
            
            if (!hasEnoughTimeBetweenReservations(endDateTime, nextStartDateTime, sameLocation)) {
                return false;
            }
        }

        // Проверка за следваща резервация
        if (currentReservation.fromDateTime >= toDateTime) {
            const endDateTime = new Date(toDateTime);
            const nextStartDateTime = new Date(currentReservation.fromDateTime);
            const sameLocation = currentReservation.fromPlace.toString() === fromLocationId.toString();
            
            if (!hasEnoughTimeBetweenReservations(endDateTime, nextStartDateTime, sameLocation)) {
                return false;
            }
        }
    }

    return true;
}

async function addReservation(reservationData) {
    const code = generateReservationCode();
    reservationData.code = code;
    const reservation = new Reservation(reservationData);
    const saved = await reservation.save();
    const populated = await saved.populate('carId');
    await sendReservationConfirmation(populated);
    
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