const Car = require('../models/carModel');
const Reservation = require('../models/reservationModel');
const PendingReservation = require('../models/pendingReservationModel');
const { isCarAvailable, addReservation, getAllReservations, convertToDateTime } = require('../services/reservationService');
const { createPaymentIntent, confirmPayment } = require('../services/paymentService');
const { sendPaymentConfirmation, sendReservationConfirmation } = require('../services/emailService');

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
                // Case 1: New reservation starts during an existing one
                {
                    fromDateTime: { $lte: fromDateTime.toISOString() },
                    toDateTime: { $gte: fromDateTime.toISOString() }
                },
                // Case 2: New reservation ends during an existing one
                {
                    fromDateTime: { $lte: toDateTime.toISOString() },
                    toDateTime: { $gte: toDateTime.toISOString() }
                },
                // Case 3: New reservation encompasses an existing one
                {
                    fromDateTime: { $gte: fromDateTime.toISOString() },
                    toDateTime: { $lte: toDateTime.toISOString() }
                }
            ]
        });

        if (existingReservations.length > 0) {
            return res.status(409).json({
                error: 'Car is already reserved for this period'
            });
        }

        // Create payment intent with Stripe
        const paymentIntent = await createPaymentIntent(carId, fromDate, toDate);

        // Store reservation data in temporary collection
        const pendingReservation = new PendingReservation({
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
            totalAmount: paymentIntent.totalAmount,
            paymentIntentId: paymentIntent.clientSecret.split('_secret_')[0],
            expiresAt: new Date(Date.now() + 30 * 60 * 1000) // Expires in 30 minutes
        });

        await pendingReservation.save();

        res.status(200).json({
            success: true,
            message: 'Payment intent created successfully',
            clientSecret: paymentIntent.clientSecret
        });
    } catch (err) {
        console.error('Payment intent creation error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment intent ID is required' });
        }

        console.log('Confirming payment for intent:', paymentIntentId);

        // Verify payment status with Stripe
        const isPaymentSuccessful = await confirmPayment(paymentIntentId);

        if (!isPaymentSuccessful) {
            console.log('Payment verification failed for intent:', paymentIntentId);
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        console.log('Payment successful, creating reservation...');

        // Find pending reservation
        const pendingReservation = await PendingReservation.findOne({ paymentIntentId });

        if (!pendingReservation) {
            console.log('Pending reservation not found for payment intent:', paymentIntentId);
            return res.status(404).json({ error: 'Reservation data not found' });
        }

        // Generate unique reservation code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Create the reservation
        const reservation = new Reservation({
            ...pendingReservation.toObject(),
            code,
            paymentStatus: 'completed'
        });

        // Remove unnecessary fields
        delete reservation._id;
        delete reservation.expiresAt;

        // Save the reservation
        const savedReservation = await reservation.save();
        const populatedReservation = await savedReservation.populate(['carId', 'fromPlace', 'toPlace']);

        // Delete the pending reservation
        await PendingReservation.deleteOne({ _id: pendingReservation._id });

        console.log('Reservation created successfully:', populatedReservation._id);

        // Send confirmation emails with retries
        let emailsSent = false;
        let retryCount = 0;
        const maxRetries = 3;

        while (!emailsSent && retryCount < maxRetries) {
            try {
                // Send payment confirmation first
                await sendPaymentConfirmation(populatedReservation);
                console.log('Payment confirmation email sent');

                // Then send reservation confirmation
                await sendReservationConfirmation(populatedReservation);
                console.log('Reservation confirmation email sent');
                
                emailsSent = true;
            } catch (emailError) {
                retryCount++;
                console.error(`Error sending confirmation emails (attempt ${retryCount}):`, emailError);
                
                if (retryCount < maxRetries) {
                    console.log(`Retrying email send in 1 second...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        if (!emailsSent) {
            console.error('Failed to send confirmation emails after all retries');
        }

        // Return success response with reservation details
        res.json({
            success: true,
            message: 'Payment confirmed and reservation created successfully',
            emailsSent,
            reservation: {
                id: populatedReservation._id,
                code: populatedReservation.code,
                customerName: populatedReservation.customerName,
                email: populatedReservation.email,
                phone: populatedReservation.phone,
                fromDate: populatedReservation.fromDate,
                toDate: populatedReservation.toDate,
                fromTime: populatedReservation.fromTime,
                toTime: populatedReservation.toTime,
                totalAmount: populatedReservation.totalAmount,
                car: {
                    make: populatedReservation.carId.make,
                    model: populatedReservation.carId.model
                },
                fromPlace: populatedReservation.fromPlace ? {
                    name: populatedReservation.fromPlace.name,
                    address: populatedReservation.fromPlace.address
                } : null,
                toPlace: populatedReservation.toPlace ? {
                    name: populatedReservation.toPlace.name,
                    address: populatedReservation.toPlace.address
                } : null
            }
        });
    } catch (err) {
        console.error('Payment confirmation error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.searchAvailableCars = async (req, res) => {
    try {
        const {
            pickupTime, returnTime,
            fromDate, toDate, fromTime, toTime,
            carId
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
                error: 'Please provide valid date and time (either as ISO string or as separate date and time)'
            });
        }

        if (isNaN(fromDateTime.getTime()) || isNaN(toDateTime.getTime())) {
            return res.status(400).json({
                error: 'Invalid date or time format'
            });
        }

        if (fromDateTime >= toDateTime) {
            return res.status(400).json({
                error: 'Start date and time must be before end date and time'
            });
        }

        // Get all cars or specific car if carId is provided
        const carsQuery = carId ? Car.findById(carId) : Car.find();
        const allCars = await carsQuery.populate('currentLocation');

        // Get all reservations that might conflict, including 2-hour gap requirement
        const MINIMUM_TIME_BETWEEN_RESERVATIONS = 120; // 2 hours in minutes
        const conflictingReservations = await Reservation.find({
            paymentStatus: 'completed',
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
        }).select('carId fromDateTime toDateTime');

        // Create a set of booked car IDs
        const bookedCarIds = new Set(conflictingReservations.map(res => res.carId.toString()));

        // Filter available cars - check for time overlap and minimum gap
        const availableCars = Array.isArray(allCars) ? allCars.filter(car => !bookedCarIds.has(car._id.toString())) : 
                             !bookedCarIds.has(allCars._id.toString()) ? [allCars] : [];

        // Format response – include image and full pricing so the frontend can render correctly
        res.json({
            count: availableCars.length,
            cars: availableCars.map(car => ({
                _id: car._id,
                name: car.name,
                make: car.make,
                model: car.model,
                currentLocation: car.currentLocation,
                mainImage: car.mainImage,
                pricing: car.pricing,
                price: car.pricing?.["1_3"] || 0 // direct convenience field
            }))
        });

    } catch (err) {
        console.error('Error searching for available cars:', err);
        res.status(500).json({ error: err.message });
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