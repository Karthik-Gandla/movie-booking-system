const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const { getMongoStatus } = require('../config/db');
const mockStore = require('../data/mockStore');

// @desc    Get Admin analytics and dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const bookings = await Booking.find().populate('movie').populate('user');
      const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'completed')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const totalTicketsSold = bookings
        .filter(b => b.paymentStatus === 'completed')
        .reduce((sum, b) => sum + (b.seats?.length || 0), 0);

      const totalMovies = await Movie.countDocuments();
      const totalShowtimes = await Showtime.countDocuments();

      return res.status(200).json({
        success: true,
        data: {
          totalRevenue: +totalRevenue.toFixed(2),
          totalBookings: bookings.length,
          totalTicketsSold,
          totalMovies,
          totalShowtimes,
          recentBookings: bookings.slice(0, 8)
        }
      });
    } else {
      const bookings = mockStore.getAllBookings();
      const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'completed')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const totalTicketsSold = bookings
        .filter(b => b.paymentStatus === 'completed')
        .reduce((sum, b) => sum + (b.seats?.length || 0), 0);

      const totalMovies = mockStore.data.movies.length;
      const totalShowtimes = mockStore.data.showtimes.length;

      return res.status(200).json({
        success: true,
        data: {
          totalRevenue: +totalRevenue.toFixed(2),
          totalBookings: bookings.length,
          totalTicketsSold,
          totalMovies,
          totalShowtimes,
          recentBookings: bookings.slice(0, 8)
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const bookings = await Booking.find()
        .populate('movie')
        .populate('theater')
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } else {
      const bookings = mockStore.getAllBookings();
      return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
