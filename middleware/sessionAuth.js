async function authenticateSession(req, res, next) {
    try {
        // Check if user is logged in via session
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Fetch user details to verify they still exist and have admin role
        const User = require('../models/userModel');
        const user = await User.findById(req.session.userId).select('-password');

        if (!user) {
            // User no longer exists, clear session
            req.session.destroy();
            return res.status(401).json({ error: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    authenticateSession
}; 