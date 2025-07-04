require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8800;

// Validate MongoDB URI
if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
}

// MongoDB connection options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit if we can't connect to the database
    });

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000']; // Default to Next.js development server

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy violation'), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Session configuration
if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required');
}

app.use(session({
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI,
        mongoOptions: mongooseOptions
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Middleware
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});