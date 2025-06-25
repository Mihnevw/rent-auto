const Car = require('../models/carModel');
const Reservation = require('../models/reservationModel');
const { isCarAvailable, addReservation, getAllReservations, convertToDateTime } = require('../services/reservationService');
// const { createPaymentIntent, confirmPayment } = require('../services/paymentService');
// const { sendPaymentConfirmation } = require('../services/emailService');

exports.getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReservations = async (req, res) => {
    try {
        const reservations = await getAllReservations();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createReservation = async (req, res) => {
    const { carId, fromDate, toDate, fromTime, toTime, fromPlace, toPlace, customerName, email, phone } = req.body;
    
    if (!carId || !fromDate || !toDate || !fromTime || !toTime || !fromPlace || !toPlace || !customerName || !email || !phone) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // Convert strings to proper Date objects and ensure correct order
        const fromDateTime = new Date(`${fromDate}T${fromTime}`);
        const toDateTime = new Date(`${toDate}T${toTime}`);

        // Validate that fromDateTime is before toDateTime
        if (fromDateTime >= toDateTime) {
            return res.status(400).json({ 
                error: 'Start date must be before end date' 
            });
        }

        // Check for existing reservations for this car in the same time period
        const existingReservations = await Reservation.find({
            carId,
            paymentStatus: 'completed',
            $or: [
                // Случай 1: Нова резервация започва по време на съществуваща
                {
                    fromDateTime: { $lte: fromDateTime.toISOString() },
                    toDateTime: { $gte: fromDateTime.toISOString() }
                },
                // Случай 2: Нова резервация завършва по време на съществуваща
                {
                    fromDateTime: { $lte: toDateTime.toISOString() },
                    toDateTime: { $gte: toDateTime.toISOString() }
                },
                // Случай 3: Нова резервация обхваща съществуваща
                {
                    fromDateTime: { $gte: fromDateTime.toISOString() },
                    toDateTime: { $lte: toDateTime.toISOString() }
                }
            ]
        });

        if (existingReservations.length > 0) {
            return res.status(409).json({
                error: 'Колата вече е резервирана за този период'
            });
        }

        // Create reservation directly for testing
        const reservationData = {
            carId,
            fromDate,
            toDate,
            fromTime,
            toTime,
            fromPlace,
            toPlace,
            customerName,
            email,
            phone,
            fromDateTime: fromDateTime.toISOString(),
            toDateTime: toDateTime.toISOString(),
            totalAmount: 100, // Dummy amount for testing
            paymentStatus: 'completed' // Set as completed for testing
        };

        // Create the reservation
        const reservation = await addReservation(reservationData);
        
        res.status(201).json({
            success: true,
            message: 'Reservation created successfully',
            reservation
        });
    } catch (err) {
        console.error('Reservation creation error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Comment out or simplify confirmPayment endpoint since we're not using payments
exports.confirmPayment = async (req, res) => {
    res.status(200).json({ success: true, message: 'Payment confirmation skipped for testing' });
};

exports.searchAvailableCars = async (req, res) => {
    try {
        const { 
            pickupTime, returnTime,
            fromDate, toDate, fromTime, toTime, 
            pickupLocation, returnLocation 
        } = req.query;

        let fromDateTime, toDateTime;

        if (pickupTime && returnTime) {
            fromDateTime = new Date(pickupTime);
            toDateTime = new Date(returnTime);
        } else if (fromDate && toDate && fromTime && toTime) {
            fromDateTime = new Date(`${fromDate}T${fromTime}`);
            toDateTime = new Date(`${toDate}T${toTime}`);
        } else {
            return res.status(400).json({
                error: 'Моля, въведете валидни дата и час (или във формат ISO string, или като отделни дата и час)'
            });
        }

        if (!pickupLocation) {
            return res.status(400).json({
                error: 'Моля, въведете локация за взимане'
            });
        }

        if (isNaN(fromDateTime.getTime()) || isNaN(toDateTime.getTime())) {
            return res.status(400).json({
                error: 'Невалиден формат на дата или час'
            });
        }

        if (fromDateTime >= toDateTime) {
            return res.status(400).json({
                error: 'Началната дата и час трябва да са преди крайната дата и час'
            });
        }

        // Get all cars with their details
        const allCars = await Car.find()
            .populate('currentLocation')
            .populate({
                path: 'currentLocation',
                select: 'name address'
            });

        // Get all reservations that might conflict
        const conflictingReservations = await Reservation.find({
            paymentStatus: 'completed',
            $or: [
                // Случай 1: Търсеният период започва по време на резервация
                {
                    fromDateTime: { $lte: fromDateTime.toISOString() },
                    toDateTime: { $gte: fromDateTime.toISOString() }
                },
                // Случай 2: Търсеният период завършва по време на резервация
                {
                    fromDateTime: { $lte: toDateTime.toISOString() },
                    toDateTime: { $gte: toDateTime.toISOString() }
                },
                // Случай 3: Търсеният период обхваща резервация
                {
                    fromDateTime: { $gte: fromDateTime.toISOString() },
                    toDateTime: { $lte: toDateTime.toISOString() }
                }
            ]
        }).select('carId fromDateTime toDateTime');

        // Create a set of booked car IDs
        const bookedCarIds = new Set(conflictingReservations.map(res => res.carId.toString()));

        // Filter available cars
        const availableCars = allCars.filter(car => {
            // Skip cars that are not at the requested location
            if (car.currentLocation?._id.toString() !== pickupLocation) {
                return false;
            }

            // Skip cars that have conflicting reservations
            if (bookedCarIds.has(car._id.toString())) {
                return false;
            }

            return true;
        });

        // Format response
        const formattedCars = availableCars.map(car => ({
            id: car._id,
            make: car.make,
            model: car.model,
            name: car.name,
            mainImage: car.mainImage,
            thumbnails: car.thumbnails,
            engine: car.engine,
            fuel: car.fuel,
            transmission: car.transmission,
            seats: car.seats,
            doors: car.doors,
            year: car.year,
            consumption: car.consumption,
            bodyType: car.bodyType,
            priceIncludes: car.priceIncludes,
            features: car.features,
            pricing: car.pricing,
            location: {
                id: car.currentLocation._id,
                name: car.currentLocation.name,
                address: car.currentLocation.address
            }
        }));

        res.json({
            count: formattedCars.length,
            cars: formattedCars
        });

    } catch (error) {
        console.error('Error searching for available cars:', error);
        res.status(500).json({
            error: 'Възникна грешка при търсенето на налични автомобили'
        });
    }
};

exports.getCarAvailability = async (req, res) => {
    try {
        const { carId } = req.params;
        const { startDate, endDate } = req.query;

        if (!carId) {
            return res.status(400).json({ error: 'Car ID is required' });
        }

        // Validate dates
        const start = startDate ? new Date(startDate) : new Date();
        const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Get all reservations for this car within the date range
        const reservations = await Reservation.find({
            carId,
            paymentStatus: 'completed',
            $or: [
                { fromDateTime: { $lte: end.toISOString() }, toDateTime: { $gte: start.toISOString() } },
                { fromDateTime: { $gte: start.toISOString(), $lte: end.toISOString() } },
                { toDateTime: { $gte: start.toISOString(), $lte: end.toISOString() } }
            ]
        }).select('fromDateTime toDateTime');

        // Define working hours
        const workingHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

        // Generate array of dates between start and end
        const availability = [];
        const currentDate = new Date(start);
        currentDate.setHours(0, 0, 0, 0);

        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const bookedHours = new Set();

            // Check each reservation for this date
            for (const reservation of reservations) {
                const resStart = new Date(reservation.fromDateTime);
                const resEnd = new Date(reservation.toDateTime);
                
                // Check if this reservation affects current date
                const resStartDate = new Date(resStart);
                const resEndDate = new Date(resEnd);
                resStartDate.setHours(0, 0, 0, 0);
                resEndDate.setHours(0, 0, 0, 0);
                const currentDateCopy = new Date(currentDate);

                if (currentDateCopy >= resStartDate && currentDateCopy <= resEndDate) {
                    // This reservation affects this date
                    const startHour = currentDateCopy.getTime() === resStartDate.getTime() 
                        ? resStart.getHours()
                        : 9;
                    
                    const endHour = currentDateCopy.getTime() === resEndDate.getTime()
                        ? resEnd.getHours()
                        : 18;

                    // Mark all hours in between as booked
                    for (let hour = startHour; hour <= endHour; hour++) {
                        bookedHours.add(`${hour.toString().padStart(2, '0')}:00`);
                    }
                }
            }

            // Calculate available hours
            const availableHours = workingHours.filter(hour => !bookedHours.has(hour));

            // Determine status based on available hours
            if (bookedHours.size === 0) {
                availability.push({
                    date: dateStr,
                    status: "available"
                });
            } else if (availableHours.length === 0) {
                availability.push({
                    date: dateStr,
                    status: "fully-booked"
                });
            } else {
                availability.push({
                    date: dateStr,
                    status: "partially-available",
                    availableHours
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        res.json({ availability });

    } catch (error) {
        console.error('Error fetching car availability:', error);
        res.status(500).json({
            error: 'Възникна грешка при проверката на наличността'
        });
    }
};