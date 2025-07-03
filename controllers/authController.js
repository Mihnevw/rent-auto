const authService = require('../services/authService');
const Car = require('../models/carModel');
const Reservation = require('../models/reservationModel');
const User = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone
        };

        const result = await authService.register(userData);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Verify token and return user data
exports.verify = async (req, res) => {
    try {
        // The authenticate middleware adds decoded token to req.user
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Fetch user details (exclude password)
        const User = require('../models/userModel');
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Dashboard stats for admin panel
exports.getDashboardStats = async (req, res) => {
    try {
        const totalCars = await Car.countDocuments();
        // Use local date string for today (e.g. '2024-06-09')
        const todayStr = new Date().toISOString().slice(0, 10);
        const reservationsToday = await Reservation.countDocuments({ fromDate: todayStr });

        // Recent reservations (last 5, sorted by fromDateTime desc)
        const recentReservations = await Reservation.find({})
          .sort({ fromDateTime: -1 })
          .limit(5)
          .populate('carId fromPlace toPlace');
        const pendingPayments = await Reservation.countDocuments({ paymentStatus: 'pending' });
        const completedPayments = await Reservation.countDocuments({ paymentStatus: 'completed' });
        res.json({ totalCars, reservationsToday, pendingPayments, completedPayments, recentReservations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 