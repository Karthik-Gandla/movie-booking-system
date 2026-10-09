require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const { getSeedData } = require('./seedData');

const seedMongo = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movieticketbooking';
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);
    console.log('MongoDB Connected. Clearing existing collections...');

    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Showtime.deleteMany({});
    await Booking.deleteMany({});

    console.log('Inserting seed records...');
    const data = getSeedData();

    await User.insertMany(data.users);
    await Movie.insertMany(data.movies);
    await Theater.insertMany(data.theaters);
    await Showtime.insertMany(data.showtimes);
    await Booking.insertMany(data.bookings);

    console.log('\x1b[32m✔ MongoDB Database seeded successfully!\x1b[0m');
    console.log(`- ${data.users.length} Users`);
    console.log(`- ${data.movies.length} Movies`);
    console.log(`- ${data.theaters.length} Theaters`);
    console.log(`- ${data.showtimes.length} Showtimes`);
    console.log(`- ${data.bookings.length} Bookings`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedMongo();
