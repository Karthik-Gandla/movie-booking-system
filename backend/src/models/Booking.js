const mongoose = require('mongoose');

const seatBookedSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  tier: { type: String, enum: ['Standard', 'Premium', 'VIP'], default: 'Standard' },
  price: { type: Number, required: true }
});

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true
    },
    seats: [seatBookedSchema],
    subtotal: {
      type: Number,
      required: true
    },
    convenienceFee: {
      type: Number,
      default: 2.50
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'failed'],
      default: 'completed'
    },
    ticketQrCode: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
