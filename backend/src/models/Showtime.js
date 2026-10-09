const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true
    },
    screenNumber: {
      type: Number,
      default: 1
    },
    screenFormat: {
      type: String,
      default: 'Dolby Atmos'
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },
    time: {
      type: String, // e.g. "14:30" or "07:00 PM"
      required: true
    },
    ticketPrices: {
      VIP: { type: Number, default: 22 },
      Premium: { type: Number, default: 16 },
      Standard: { type: Number, default: 12 }
    },
    bookedSeats: {
      type: [String], // Array of seat IDs like "A1", "C4"
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Showtime', showtimeSchema);
