// user.js
const Mongoose = require('mongoose');
const AppDataSchema = new Mongoose.Schema({
  highestUserID: {
    type: Number,
    required: true,
    default: 1,
  },
});

const AppData = Mongoose.model('appdata', AppDataSchema);
module.exports = AppData;
