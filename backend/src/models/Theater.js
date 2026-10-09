const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: { type: Number, required: true },
  name: { type: String, default: 'Screen 1' },
  format: { type: String, default: 'Dolby Atmos 4K' }, // IMAX 3D, Dolby Atmos, 4DX, Standard
  totalSeats: { type: Number, default: 80 },
  seatLayout: {
    rows: { type: Number, default: 8 },
    columns: { type: Number, default: 10 },
    rowLabels: {
      type: [String],
      default: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    },
    seatCategories: [
      {
        name: { type: String, default: 'Standard' }, // VIP, Premium, Standard
        rows: [String],
        basePrice: Number
      }
    ]
  }
});

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theater name is required']
    },
    chain: {
      type: String,
      default: 'Cineplex'
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      index: true
    },
    address: {
      type: String,
      required: true
    },
    screens: [screenSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Theater', theaterSchema);
