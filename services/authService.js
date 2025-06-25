const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

async function register(userData) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email already registered');
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Return user data and token
    const { password, ...userWithoutPassword } = user.toObject();
    return { user: userWithoutPassword, token };
}

async function login(email, password) {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user);

    // Return user data and token
    const { password: pwd, ...userWithoutPassword } = user.toObject();
    return { user: userWithoutPassword, token };
}

function generateToken(user) {
    return jwt.sign(
        { 
            userId: user._id,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = {
    register,
    login,
    verifyToken
}; 