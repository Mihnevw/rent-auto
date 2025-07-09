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

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rent-a-car', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',') 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required');
}

app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('images'));
app.use(bodyParser.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});