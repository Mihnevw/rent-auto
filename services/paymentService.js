if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Car = require('../models/carModel');

function calculateTotalPrice(pricing, fromDate, toDate) {
    // Parse as local dates (ignore time zone issues)
    const start = new Date(fromDate + 'T00:00:00');
    const end = new Date(toDate + 'T00:00:00');

    // Calculate days difference (inclusive)
    const timeDiff = end.getTime() - start.getTime();
    let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Always at least 1 day
    days = Math.max(1, days);

    // If toDate is the same as fromDate, or if the rental is for part of the last day, count as extra day
    if (days >= 1) {
        days += 1;
    }

    let pricePerDay;
    if (days <= 3) {
        pricePerDay = pricing['1_3'];
    } else if (days <= 7) {
        pricePerDay = pricing['4_7'];
    } else if (days <= 14) {
        pricePerDay = pricing['8_14'];
    } else {
        pricePerDay = pricing['15_plus'];
    }

    if (!pricePerDay || pricePerDay <= 0) {
        throw new Error('Invalid price configuration for the selected car');
    }

    const totalPrice = days * pricePerDay;
    return Math.max(1, totalPrice);
}

async function createPaymentIntent(carId, fromDate, toDate) {
    try {
        const car = await Car.findById(carId);
        if (!car) {
            throw new Error('Car not found');
        }

        if (!car.pricing) {
            throw new Error('Car pricing is not configured');
        }

        const totalAmount = calculateTotalPrice(car.pricing, fromDate, toDate);

        // Convert to stotinki (cents) for Stripe
        const amountInStotinki = Math.round(totalAmount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInStotinki,
            currency: 'eur',
            payment_method_types: ['card'],
            metadata: {
                carId: carId,
                fromDate: fromDate,
                toDate: toDate,
                totalAmount: totalAmount // Store original amount for reference
            }
        });

        return {
            clientSecret: paymentIntent.client_secret,
            totalAmount: totalAmount
        };
    } catch (error) {
        console.error('Payment intent creation error:', error);
        throw new Error(`Error creating payment intent: ${error.message}`);
    }
}

async function confirmPayment(paymentIntentId) {
    try {
        console.log('Retrieving payment intent:', paymentIntentId);
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log('Payment intent status:', paymentIntent.status);

        // Consider both 'succeeded' and 'processing' as successful states
        const successfulStates = ['succeeded', 'processing'];
        return successfulStates.includes(paymentIntent.status);
    } catch (error) {
        console.error('Payment confirmation error:', error);
        throw new Error(`Error confirming payment: ${error.message}`);
    }
}

module.exports = {
    createPaymentIntent,
    confirmPayment,
    calculateTotalPrice
}; 