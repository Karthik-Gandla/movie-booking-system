const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const { getMongoStatus } = require('../config/db');
const mockStore = require('../data/mockStore');

// @desc    Create a new booking & reserve seats
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { showtimeId, seats, promoCode, paymentMethod } = req.body;
    const userId = req.user._id || req.user.id;

    if (!showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide showtimeId and at least one seat' });
    }

    const seatNumbers = seats.map(s => s.seatNumber);

    if (getMongoStatus()) {
      const showtime = await Showtime.findById(showtimeId);
      if (!showtime) {
        return res.status(404).json({ success: false, message: 'Showtime not found' });
      }

      // Check seat availability
      const conflict = seatNumbers.filter(sn => showtime.bookedSeats.includes(sn));
      if (conflict.length > 0) {
        return res.status(400).json({ success: false, message: `Seat(s) ${conflict.join(', ')} already booked` });
      }

      // Calculate totals
      const subtotal = seats.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
      const convenienceFee = 2.50;
      let discount = 0;

      if (promoCode && promoCode.toUpperCase() === 'CINEMA20') {
        discount = +(subtotal * 0.20).toFixed(2);
      }

      const taxableAmount = subtotal - discount;
      const tax = +(taxableAmount * 0.08).toFixed(2);
      const totalAmount = +(taxableAmount + convenienceFee + tax).toFixed(2);

      const refCode = 'CNP-' + Math.floor(10000 + Math.random() * 90000);

      const booking = await Booking.create({
        bookingReference: refCode,
        user: userId,
        movie: showtime.movie,
        theater: showtime.theater,
        showtime: showtime._id,
        seats: seats.map(s => ({
          seatNumber: s.seatNumber,
          tier: s.tier || 'Standard',
          price: s.price
        })),
        subtotal,
        convenienceFee,
        discount,
        tax,
        totalAmount,
        paymentMethod: paymentMethod || 'Credit Card',
        paymentStatus: 'completed',
        ticketQrCode: `${refCode}-${showtime.movie}-${seatNumbers.join('-')}`
      });

      // Update booked seats on showtime
      showtime.bookedSeats.push(...seatNumbers);
      await showtime.save();

      const populatedBooking = await Booking.findById(booking._id)
        .populate('movie')
        .populate('theater')
        .populate('showtime');

      return res.status(201).json({ success: true, data: populatedBooking });
    } else {
      // Mock mode
      const showtime = mockStore.getShowtimeById(showtimeId);
      if (!showtime) {
        return res.status(404).json({ success: false, message: 'Showtime not found' });
      }

      // Check conflict
      const conflict = seatNumbers.filter(sn => (showtime.bookedSeats || []).includes(sn));
      if (conflict.length > 0) {
        return res.status(400).json({ success: false, message: `Seat(s) ${conflict.join(', ')} already booked` });
      }

      // Calculate totals
      const subtotal = seats.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
      const convenienceFee = 2.50;
      let discount = 0;

      if (promoCode && promoCode.toUpperCase() === 'CINEMA20') {
        discount = +(subtotal * 0.20).toFixed(2);
      }

      const taxableAmount = subtotal - discount;
      const tax = +(taxableAmount * 0.08).toFixed(2);
      const totalAmount = +(taxableAmount + convenienceFee + tax).toFixed(2);

      // Lock seats on showtime
      mockStore.bookSeatsOnShowtime(showtimeId, seatNumbers);

      const booking = mockStore.createBooking({
        user: userId,
        movie: showtime.movie._id,
        theater: showtime.theater._id,
        showtime: showtime._id,
        seats: seats.map(s => ({
          seatNumber: s.seatNumber,
          tier: s.tier || 'Standard',
          price: s.price
        })),
        subtotal,
        convenienceFee,
        discount,
        tax,
        totalAmount,
        paymentMethod: paymentMethod || 'Credit Card',
        ticketQrCode: `QR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      });

      return res.status(201).json({ success: true, data: booking });
    }
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: 'Booking failed: ' + error.message });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getMongoStatus()) {
      const bookings = await Booking.find({ user: userId })
        .populate('movie')
        .populate('theater')
        .populate('showtime')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } else {
      const bookings = mockStore.getUserBookings(userId);
      return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get booking by ID or reference code
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      let booking;
      if (id.startsWith('CNP-')) {
        booking = await Booking.findOne({ bookingReference: id }).populate('movie').populate('theater').populate('showtime');
      } else {
        booking = await Booking.findById(id).populate('movie').populate('theater').populate('showtime');
      }

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      return res.status(200).json({ success: true, data: booking });
    } else {
      const booking = mockStore.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      return res.status(200).json({ success: true, data: booking });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel a booking and release seats
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (getMongoStatus()) {
      const booking = await Booking.findOne({ _id: id, user: userId });
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found or unauthorized' });
      }

      if (booking.paymentStatus === 'refunded') {
        return res.status(400).json({ success: false, message: 'Booking already cancelled' });
      }

      booking.paymentStatus = 'refunded';
      await booking.save();

      // Release seats from showtime
      const showtime = await Showtime.findById(booking.showtime);
      if (showtime) {
        const bookedSeatNumbers = booking.seats.map(s => s.seatNumber);
        showtime.bookedSeats = showtime.bookedSeats.filter(sn => !bookedSeatNumbers.includes(sn));
        await showtime.save();
      }

      return res.status(200).json({ success: true, message: 'Booking cancelled and seats released', data: booking });
    } else {
      const booking = mockStore.cancelBooking(id, userId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      return res.status(200).json({ success: true, message: 'Booking cancelled and seats released', data: booking });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
