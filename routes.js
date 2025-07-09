const express = require('express');
const multer = require('multer');
const path = require('path');
const reservationController = require('./controllers/reservationController');
const carController = require('./controllers/carController');
const locationController = require('./controllers/locationController');
const authController = require('./controllers/authController');
const contactController = require('./controllers/contactController');
const userController = require('./controllers/userController');
const { authenticate } = require('./middleware/auth');
const { authenticateSession } = require('./middleware/sessionAuth');

const router = express.Router();

// Настройка на multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Authentication routes
//router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authController.verify);

// Public routes
router.get('/cars', carController.getAllCars);
router.get('/cars/:id', carController.getCarById);
router.get('/locations', locationController.getAllLocations);
router.get('/locations/:id', locationController.getLocationById);

// Protected routes (admin only)
router.post('/cars', authenticateSession, upload.single('image'), carController.createCar);
router.put('/cars/:id', authenticateSession, carController.updateCar);
router.delete('/cars/:id', authenticateSession, carController.deleteCar);
router.put('/cars/:id/location', authenticateSession, carController.updateCarLocation);

// Reservation routes
router.get('/reservations', authenticateSession, reservationController.getReservations);
router.get('/reservations/cars/available', reservationController.searchAvailableCars);
router.get('/reservations/availability/:carId', reservationController.getCarAvailability);
router.post('/reservations',  reservationController.createReservation);
router.post('/reservations/confirm-payment', reservationController.confirmPayment);
router.put('/reservations/:id', authenticateSession, reservationController.updateReservation);
router.delete('/reservations/:id', authenticateSession, reservationController.deleteReservation);

// Location management routes
router.post('/locations', authenticateSession, locationController.createLocation);
router.put('/locations/:id', authenticateSession, locationController.updateLocation);
router.delete('/locations/:id', authenticateSession, locationController.deleteLocation);

// Contact form route
router.post('/contact', contactController.submitContactForm);

// User management routes
router.get('/users', authenticateSession, userController.getUsers);
router.post('/users', authenticateSession, userController.createUser);
router.put('/users/:id', authenticateSession, userController.updateUser);
router.delete('/users/:id', authenticateSession, userController.deleteUser);

// Dashboard stats route
router.get('/admin/dashboard-stats', authenticateSession, authController.getDashboardStats);

module.exports = router;