const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Movie description is required']
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required']
    },
    backdropUrl: {
      type: String,
      default: ''
    },
    trailerUrl: {
      type: String,
      default: ''
    },
    genres: {
      type: [String],
      required: true
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration in minutes is required']
    },
    language: {
      type: String,
      default: 'English'
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.5
    },
    votesCount: {
      type: Number,
      default: 1200
    },
    certificate: {
      type: String,
      enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'UA', 'A'],
      default: 'PG-13'
    },
    releaseDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['now_showing', 'coming_soon'],
      default: 'now_showing'
    },
    director: {
      type: String,
      default: ''
    },
    cast: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Movie', movieSchema);
