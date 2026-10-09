const express = require('express');
const router = express.Router();
const { getTheaters, getTheaterById, createTheater } = require('../controllers/theaterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getTheaters);
router.get('/:id', getTheaterById);
router.post('/', protect, authorize('admin'), createTheater);

module.exports = router;
