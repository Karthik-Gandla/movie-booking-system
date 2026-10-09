const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getMongoStatus } = require('../config/db');
const mockStore = require('../data/mockStore');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_movie_booking_2026_xyz';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (getMongoStatus()) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      req.user = mockStore.findUserById(decoded.id);
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed: ' + err.message });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
