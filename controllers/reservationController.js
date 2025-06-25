const Car = require('../models/carModel');
const Reservation = require('../models/reservationModel');
const { isCarAvailable, addReservation, getAllReservations } = require('../services/reservationService');
const { createPaymentIntent, confirmPayment } = require('../services/paymentService');
const { sendPaymentConfirmation } = require('../services/emailService');

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

    const fromDateTime = `${fromDate}T${fromTime}`;
    const toDateTime = `${toDate}T${toTime}`;

    try {
        // Check if car is available
        const available = await isCarAvailable(carId, fromDateTime, toDateTime, fromPlace);
        
        if (!available) {
            return res.status(409).json({ 
                error: 'Car is not available for the selected dates, times, and location. Please check if there is enough time for the car to be relocated between reservations.'
            });
        }

        // Create payment intent first
        const { clientSecret, totalAmount } = await createPaymentIntent(carId, fromDate, toDate);

        // Store reservation data temporarily
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
            fromDateTime,
            toDateTime,
            totalAmount,
            paymentStatus: 'pending'
        };

        // Store temporary reservation data in session or temporary storage
        // We'll create the actual reservation after payment confirmation
        req.session = req.session || {};
        req.session.pendingReservation = reservationData;
        
        // Return client secret for payment processing
        res.status(200).json({
            paymentIntent: {
                clientSecret: clientSecret
            },
            totalAmount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        const pendingReservation = req.session?.pendingReservation;

        if (!paymentIntentId || !pendingReservation) {
            return res.status(400).json({ error: 'Missing payment intent ID or reservation data' });
        }

        // First confirm the payment
        const isConfirmed = await confirmPayment(paymentIntentId);
        
        if (isConfirmed) {
            try {
                // Create the reservation only after payment is confirmed
                const reservation = await addReservation({
                    ...pendingReservation,
                    paymentStatus: 'completed',
                    paymentIntentId: paymentIntentId
                });

                // Send confirmation email
                await sendPaymentConfirmation(reservation);

                // Clear the pending reservation from session
                delete req.session.pendingReservation;
                
                res.json({ 
                    success: true, 
                    message: 'Payment confirmed and reservation created successfully',
                    reservation
                });
            } catch (error) {
                // If reservation creation fails after payment
                console.error('Reservation creation error:', error);
                res.status(500).json({ 
                    error: 'Payment was successful but reservation creation failed. Our team will contact you shortly.',
                    paymentIntentId
                });
            }
        } else {
            res.status(400).json({ error: 'Payment confirmation failed' });
        }
    } catch (err) {
        console.error('Payment confirmation error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.searchAvailableCars = async (req, res) => {
    try {
        const { pickupTime, returnTime, pickupLocation, returnLocation } = req.query;

        // Validate required parameters
        if (!pickupTime || !returnTime || !pickupLocation || !returnLocation) {
            return res.status(400).json({
                error: 'Моля, въведете всички задължителни полета: час на взимане, час на оставяне, място на взимане и място на оставяне'
            });
        }

        // Validate datetime format and ensure pickup is before return
        const pickupDateTime = new Date(pickupTime);
        const returnDateTime = new Date(returnTime);

        if (isNaN(pickupDateTime.getTime()) || isNaN(returnDateTime.getTime())) {
            return res.status(400).json({
                error: 'Невалиден формат на дата и час'
            });
        }

        if (pickupDateTime >= returnDateTime) {
            return res.status(400).json({
                error: 'Часът на взимане трябва да бъде преди часа на оставяне'
            });
        }

        // Get all cars
        const allCars = await Car.find().populate('currentLocation');

        // Filter available cars
        const availableCars = [];
        for (const car of allCars) {
            // Check if car is available for the requested period
            const isAvailable = await isCarAvailable(
                car._id,
                pickupTime,
                returnTime,
                pickupLocation
            );

            if (isAvailable) {
                availableCars.push(car);
            }
        }

        res.json({
            count: availableCars.length,
            cars: availableCars
        });

    } catch (error) {
        console.error('Error searching for available cars:', error);
        res.status(500).json({
            error: 'Възникна грешка при търсенето на налични автомобили'
        });
    }
};