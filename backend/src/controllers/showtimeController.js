const Showtime = require('../models/Showtime');
const { getMongoStatus } = require('../config/db');
const mockStore = require('../data/mockStore');

// @desc    Get showtimes filtered by movie, date, or theater
// @route   GET /api/showtimes
exports.getShowtimes = async (req, res) => {
  try {
    const { movie, date, theater } = req.query;

    if (getMongoStatus()) {
      let query = {};
      if (movie) query.movie = movie;
      if (date) query.date = date;
      if (theater) query.theater = theater;

      const showtimes = await Showtime.find(query)
        .populate('movie', 'title posterUrl duration certificate rating')
        .populate('theater', 'name city address screens')
        .sort({ time: 1 });

      return res.status(200).json({ success: true, count: showtimes.length, data: showtimes });
    } else {
      const showtimes = mockStore.getShowtimes({ movie, date, theater });
      return res.status(200).json({ success: true, count: showtimes.length, data: showtimes });
    }
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get single showtime by ID (includes seat map)
// @route   GET /api/showtimes/:id
exports.getShowtimeById = async (req, res) => {
  try {
    const { id } = req.params;
    let showtime;

    if (getMongoStatus()) {
      showtime = await Showtime.findById(id)
        .populate('movie')
        .populate('theater');
    } else {
      showtime = mockStore.getShowtimeById(id);
    }

    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    // Generate comprehensive seat layout matrix for frontend
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = 10;
    const seatMap = [];

    rows.forEach((rowLetter) => {
      let tier = 'Premium';
      let price = showtime.ticketPrices?.Premium || 16;

      if (['A', 'B'].includes(rowLetter)) {
        tier = 'Standard';
        price = showtime.ticketPrices?.Standard || 12;
      } else if (['G', 'H'].includes(rowLetter)) {
        tier = 'VIP';
        price = showtime.ticketPrices?.VIP || 22;
      }

      for (let col = 1; col <= cols; col++) {
        const seatId = `${rowLetter}${col}`;
        const isBooked = (showtime.bookedSeats || []).includes(seatId);

        seatMap.push({
          seatNumber: seatId,
          row: rowLetter,
          column: col,
          tier,
          price,
          status: isBooked ? 'booked' : 'available'
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        ...((showtime.toObject && showtime.toObject()) || showtime),
        seatMap
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Create showtime (Admin)
// @route   POST /api/showtimes
exports.createShowtime = async (req, res) => {
  try {
    let showtime;
    if (getMongoStatus()) {
      showtime = await Showtime.create(req.body);
    } else {
      showtime = mockStore.createShowtime(req.body);
    }
    return res.status(201).json({ success: true, data: showtime });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
