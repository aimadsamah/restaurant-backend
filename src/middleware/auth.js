const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+isActive');

    if (!user || !user.isActive) {
      return errorResponse(res, 'User not found or inactive.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired.', 401);
    }
    return errorResponse(res, 'Authentication failed.', 401);
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || !['admin', 'superadmin'].includes(req.user.role)) {
    return errorResponse(res, 'Admin access required.', 403);
  }
  next();
};

module.exports = { protect, adminOnly };
