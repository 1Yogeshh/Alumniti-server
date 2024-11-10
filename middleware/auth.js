const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAdmin = async (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        
        // Find the user from the token payload (decoded.userId should be set when generating the token)
        req.user = await User.findById(decoded.userId);

        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure the user has admin privileges
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // Proceed to the next middleware if user is admin
        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error.message);  // Log for debugging
        // Handle token expiration or invalid token errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Token is not valid', details: error.message });
    }
};
