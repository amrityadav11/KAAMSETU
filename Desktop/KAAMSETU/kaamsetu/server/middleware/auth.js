const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/response');

const protect = async (req, res, next) => {
    try {
        let token;

        // Try HTTP-only cookie first, then Authorization header
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return sendError(res, 'Not authorized, please login', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return sendError(res, 'User not found', 401);
        }

        if (!user.isActive) {
            return sendError(res, 'Your account has been suspended', 403);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return sendError(res, 'Invalid token', 401);
        }
        if (error.name === 'TokenExpiredError') {
            return sendError(res, 'Token expired, please login again', 401);
        }
        return sendError(res, 'Not authorized', 401);
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return sendError(res, `Role '${req.user.role}' is not authorized for this action`, 403);
        }
        next();
    };
};

module.exports = { protect, authorize };
