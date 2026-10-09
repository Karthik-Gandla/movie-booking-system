const express = require('express');
const router = express.Router();
const { getShowtimes, getShowtimeById, createShowtime } = require('../controllers/showtimeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getShowtimes);
router.get('/:id', getShowtimeById);
router.post('/', protect, authorize('admin'), createShowtime);

module.exports = router;
