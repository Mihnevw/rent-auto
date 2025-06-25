const mongoose = require('mongoose');
const User = require('../models/userModel');

async function createFirstAdmin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/rent-a-car', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const adminData = {
            email: 'admin@rentacar.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            phone: '+1234567890'
        };

        const admin = new User(adminData);
        await admin.save();

        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createFirstAdmin(); 