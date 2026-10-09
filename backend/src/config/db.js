const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movieticketbooking';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if Mongo isn't running
    });
    isMongoConnected = true;
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.log(`\x1b[33mℹ MongoDB connection skipped (${error.message}).\x1b[0m`);
    console.log(`\x1b[36m✔ Seamlessly operating with local Mock/In-Memory database engine.\x1b[0m`);
    return false;
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, getMongoStatus };
