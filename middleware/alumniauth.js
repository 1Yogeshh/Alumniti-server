// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify if the user is a student or alumni
exports.isStudentOrAlumni = async (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        // Find the user from the token payload
        req.user = await User.findById(decoded.userId); // Exclude password for security

        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure the user has either 'student' or 'alumni' role
        if (req.user.role !== 'alumni' && req.user.role !== 'student') {
            return res.status(403).json({ message: 'Access denied. Only students and alumni are allowed.' });
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error('Error in isStudentOrAlumni middleware:', error.message);  // Log for debugging
        
        // Handle token expiration or invalid token errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Token is not valid', details: error.message });
    }
};
