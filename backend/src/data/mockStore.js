const fs = require('fs');
const path = require('path');
const { getSeedData } = require('./seedData');

const dbFilePath = path.join(__dirname, 'db.json');

class MockDatabase {
  constructor() {
    this.data = {
      users: [],
      movies: [],
      theaters: [],
      showtimes: [],
      bookings: []
    };
    this.init();
  }

  init() {
    if (fs.existsSync(dbFilePath)) {
      try {
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        this.data = JSON.parse(raw);
        console.log('\x1b[36m✔ Loaded persistent local mock DB from data/db.json\x1b[0m');
        return;
      } catch (e) {
        console.warn('Error reading db.json, re-seeding...');
      }
    }
    // Seed default data
    this.data = getSeedData();
    this.save();
    console.log('\x1b[36m✔ Initialized and seeded fresh mock database\x1b[0m');
  }

  save() {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to persist mock DB:', e);
    }
  }

  // --- Users ---
  findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.data.users.find(u => u._id.toString() === id.toString());
  }

  createUser(userData) {
    const newUser = {
      _id: 'u_' + Date.now().toString(16),
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // --- Movies ---
  getAllMovies(filter = {}) {
    let list = [...this.data.movies];
    if (filter.status) {
      list = list.filter(m => m.status === filter.status);
    }
    if (filter.genre && filter.genre !== 'All') {
      list = list.filter(m => m.genres && m.genres.some(g => g.toLowerCase() === filter.genre.toLowerCase()));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(m => m.title.toLowerCase().includes(q) || (m.director && m.director.toLowerCase().includes(q)));
    }
    return list;
  }

  getMovieById(id) {
    return this.data.movies.find(m => m._id.toString() === id.toString());
  }

  createMovie(movieData) {
    const newMovie = {
      _id: 'm_' + Date.now().toString(16),
      votesCount: 0,
      rating: movieData.rating || 8.0,
      status: movieData.status || 'now_showing',
      createdAt: new Date().toISOString(),
      ...movieData
    };
    this.data.movies.push(newMovie);
    this.save();
    return newMovie;
  }

  deleteMovie(id) {
    const idx = this.data.movies.findIndex(m => m._id.toString() === id.toString());
    if (idx !== -1) {
      const removed = this.data.movies.splice(idx, 1)[0];
      this.save();
      return removed;
    }
    return null;
  }

  // --- Theaters ---
  getAllTheaters(city = null) {
    if (city && city !== 'All') {
      return this.data.theaters.filter(t => t.city.toLowerCase() === city.toLowerCase());
    }
    return this.data.theaters;
  }

  getTheaterById(id) {
    return this.data.theaters.find(t => t._id.toString() === id.toString());
  }

  createTheater(theaterData) {
    const newTheater = {
      _id: 't_' + Date.now().toString(16),
      screens: [],
      ...theaterData
    };
    this.data.theaters.push(newTheater);
    this.save();
    return newTheater;
  }

  // --- Showtimes ---
  getShowtimes(query = {}) {
    let list = [...this.data.showtimes];
    if (query.movie) {
      list = list.filter(s => s.movie.toString() === query.movie.toString());
    }
    if (query.date) {
      list = list.filter(s => s.date === query.date);
    }
    if (query.theater) {
      list = list.filter(s => s.theater.toString() === query.theater.toString());
    }

    // Populate movie and theater
    return list.map(s => {
      const movie = this.getMovieById(s.movie);
      const theater = this.getTheaterById(s.theater);
      return {
        ...s,
        movie: movie ? { _id: movie._id, title: movie.title, posterUrl: movie.posterUrl, duration: movie.duration, certificate: movie.certificate } : null,
        theater: theater ? { _id: theater._id, name: theater.name, city: theater.city, address: theater.address, screens: theater.screens } : null
      };
    });
  }

  getShowtimeById(id) {
    const s = this.data.showtimes.find(st => st._id.toString() === id.toString());
    if (!s) return null;
    const movie = this.getMovieById(s.movie);
    const theater = this.getTheaterById(s.theater);
    return {
      ...s,
      movie,
      theater
    };
  }

  createShowtime(stData) {
    const newSt = {
      _id: 'st_' + Date.now().toString(16),
      bookedSeats: [],
      ticketPrices: stData.ticketPrices || { Standard: 12, Premium: 16, VIP: 22 },
      ...stData
    };
    this.data.showtimes.push(newSt);
    this.save();
    return this.getShowtimeById(newSt._id);
  }

  bookSeatsOnShowtime(showtimeId, seatNumbers) {
    const s = this.data.showtimes.find(st => st._id.toString() === showtimeId.toString());
    if (!s) throw new Error('Showtime not found');

    // Check conflict
    const alreadyBooked = seatNumbers.filter(seat => s.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      throw new Error(`Seats already booked: ${alreadyBooked.join(', ')}`);
    }

    s.bookedSeats.push(...seatNumbers);
    this.save();
    return s;
  }

  // --- Bookings ---
  createBooking(bookingData) {
    const refCode = 'CNP-' + Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      _id: 'b_' + Date.now().toString(16),
      bookingReference: refCode,
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    this.data.bookings.push(newBooking);
    this.save();

    // Populate for response
    const movie = this.getMovieById(newBooking.movie);
    const theater = this.getTheaterById(newBooking.theater);
    const showtime = this.getShowtimeById(newBooking.showtime);
    return {
      ...newBooking,
      movie,
      theater,
      showtime
    };
  }

  getUserBookings(userId) {
    const bookings = this.data.bookings.filter(b => b.user.toString() === userId.toString());
    return bookings.map(b => {
      const movie = this.getMovieById(b.movie);
      const theater = this.getTheaterById(b.theater);
      const showtime = this.getShowtimeById(b.showtime);
      return {
        ...b,
        movie,
        theater,
        showtime
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getBookingById(id) {
    const b = this.data.bookings.find(bk => bk._id.toString() === id.toString() || bk.bookingReference === id);
    if (!b) return null;
    const movie = this.getMovieById(b.movie);
    const theater = this.getTheaterById(b.theater);
    const showtime = this.getShowtimeById(b.showtime);
    return {
      ...b,
      movie,
      theater,
      showtime
    };
  }

  cancelBooking(bookingId, userId) {
    const idx = this.data.bookings.findIndex(b => b._id.toString() === bookingId.toString() && b.user.toString() === userId.toString());
    if (idx === -1) return null;

    const booking = this.data.bookings[idx];
    booking.paymentStatus = 'refunded';

    // Release seats from showtime
    const st = this.data.showtimes.find(s => s._id.toString() === booking.showtime.toString());
    if (st && booking.seats) {
      const seatNames = booking.seats.map(s => s.seatNumber);
      st.bookedSeats = st.bookedSeats.filter(sn => !seatNames.includes(sn));
    }

    this.save();
    return booking;
  }

  getAllBookings() {
    return this.data.bookings.map(b => {
      const movie = this.getMovieById(b.movie);
      const theater = this.getTheaterById(b.theater);
      const user = this.findUserById(b.user);
      return {
        ...b,
        movie,
        theater,
        user: user ? { name: user.name, email: user.email } : null
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

const mockStore = new MockDatabase();
module.exports = mockStore;
