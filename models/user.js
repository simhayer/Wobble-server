// user.js
const Mongoose = require('mongoose');
const UserSchema = new Mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    default: '',
  },
  userID: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    // Increased the length to accommodate hashed passwords (e.g., 60 characters for bcrypt)
    maxlength: 100,
  },
  role: {
    type: String,
    default: 'Basic',
    required: true,
  },
  resetCode: {
    type: String,
    default: 'Basic',
    required: false,
  },
  profilePicture: {
    type: String,
    default: '',
  },
});

const User = Mongoose.model('user', UserSchema);
module.exports = User;
