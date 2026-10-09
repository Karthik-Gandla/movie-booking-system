const Theater = require('../models/Theater');
const { getMongoStatus } = require('../config/db');
const mockStore = require('../data/mockStore');

// @desc    Get all theaters (optional filter by city)
// @route   GET /api/theaters
exports.getTheaters = async (req, res) => {
  try {
    const { city } = req.query;

    if (getMongoStatus()) {
      let query = {};
      if (city && city !== 'All') query.city = new RegExp(city, 'i');
      const theaters = await Theater.find(query);
      return res.status(200).json({ success: true, count: theaters.length, data: theaters });
    } else {
      const theaters = mockStore.getAllTheaters(city);
      return res.status(200).json({ success: true, count: theaters.length, data: theaters });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get theater by ID
// @route   GET /api/theaters/:id
exports.getTheaterById = async (req, res) => {
  try {
    const { id } = req.params;
    let theater;

    if (getMongoStatus()) {
      theater = await Theater.findById(id);
    } else {
      theater = mockStore.getTheaterById(id);
    }

    if (!theater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    return res.status(200).json({ success: true, data: theater });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create theater (Admin)
// @route   POST /api/theaters
exports.createTheater = async (req, res) => {
  try {
    let theater;
    if (getMongoStatus()) {
      theater = await Theater.create(req.body);
    } else {
      theater = mockStore.createTheater(req.body);
    }
    return res.status(201).json({ success: true, data: theater });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
