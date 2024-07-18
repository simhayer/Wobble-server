// db.js
const mongoose = require('mongoose');
const AppData = require('./AppData'); // Ensure the path is correct

const localDB = `mongodb://0.0.0.0:27017/role_auth`;

const initializeAppData = async () => {
  try {
    const highestUserID = await AppData.findOne();
    if (!highestUserID) {
      await AppData.create({highestUserID: 1});
    }
  } catch (error) {
    console.error('Error initializing app data:', error);
  }
};

const connectDB = async () => {
  await mongoose.connect(localDB, {});
  console.log('MongoDB Connected');
  await initializeAppData();
};

module.exports = connectDB;
