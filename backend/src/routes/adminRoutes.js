const express = require('express');
const router = express.Router();
const { getStats, getAllBookings } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/bookings', protect, authorize('admin'), getAllBookings);

module.exports = router;
