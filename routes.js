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
router.get('/verify', authenticate, authController.verify);

// Public routes
router.get('/cars', carController.getAllCars);
router.get('/cars/:id', carController.getCarById);
router.get('/locations', locationController.getAllLocations);
router.get('/locations/:id', locationController.getLocationById);

// Protected routes (admin only)
router.post('/cars', authenticate, upload.single('image'), carController.createCar);
router.put('/cars/:id', authenticate, carController.updateCar);
router.delete('/cars/:id', authenticate, carController.deleteCar);
router.put('/cars/:id/location', authenticate, carController.updateCarLocation);

// Reservation routes
router.get('/reservations', authenticate, reservationController.getReservations);
router.get('/reservations/cars/available', reservationController.searchAvailableCars);
router.get('/reservations/availability/:carId', reservationController.getCarAvailability);
router.post('/reservations',  reservationController.createReservation);
router.post('/reservations/confirm-payment', reservationController.confirmPayment);
router.put('/reservations/:id', authenticate, reservationController.updateReservation);
router.delete('/reservations/:id', authenticate, reservationController.deleteReservation);

// Location management routes
router.post('/locations', authenticate, locationController.createLocation);
router.put('/locations/:id', authenticate, locationController.updateLocation);
router.delete('/locations/:id', authenticate, locationController.deleteLocation);

// Contact form route
router.post('/contact', contactController.submitContactForm);

// User management routes
router.get('/users', authenticate, userController.getUsers);
router.post('/users', authenticate, userController.createUser);
router.put('/users/:id', authenticate, userController.updateUser);
router.delete('/users/:id', authenticate, userController.deleteUser);

// Dashboard stats route
router.get('/admin/dashboard-stats', authenticate, authController.getDashboardStats);

module.exports = router;