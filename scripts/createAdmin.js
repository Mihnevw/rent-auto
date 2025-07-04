require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');

if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD environment variable is required');
}

async function createFirstAdmin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/rent-a-car', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const adminData = {
            email: 'admin@rentacar.com',
            password: process.env.ADMIN_PASSWORD,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            phone: '+359123456789'
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