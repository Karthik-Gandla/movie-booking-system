const Movie = require('../models/Movie');
const { getMongoStatus } = require('../config/db');
const mockStore = require('../data/mockStore');

// @desc    Get all movies with filtering & search
// @route   GET /api/movies
exports.getMovies = async (req, res) => {
  try {
    const { status, genre, search } = req.query;

    if (getMongoStatus()) {
      let query = {};
      if (status) query.status = status;
      if (genre && genre !== 'All') query.genres = genre;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { director: { $regex: search, $options: 'i' } }
        ];
      }
      const movies = await Movie.find(query).sort({ rating: -1, releaseDate: -1 });
      return res.status(200).json({ success: true, count: movies.length, data: movies });
    } else {
      const movies = mockStore.getAllMovies({ status, genre, search });
      return res.status(200).json({ success: true, count: movies.length, data: movies });
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    let movie;

    if (getMongoStatus()) {
      movie = await Movie.findById(id);
    } else {
      movie = mockStore.getMovieById(id);
    }

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    return res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create a new movie (Admin)
// @route   POST /api/movies
exports.createMovie = async (req, res) => {
  try {
    const movieData = req.body;
    let movie;

    if (getMongoStatus()) {
      movie = await Movie.create(movieData);
    } else {
      movie = mockStore.createMovie(movieData);
    }

    return res.status(201).json({ success: true, data: movie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete movie (Admin)
// @route   DELETE /api/movies/:id
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    if (getMongoStatus()) {
      await Movie.findByIdAndDelete(id);
    } else {
      mockStore.deleteMovie(id);
    }
    return res.status(200).json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
