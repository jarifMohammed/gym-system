const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: { type: String, required: true }, // already hashed in auth module
  age: Number,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  phone: String,
  address: String,
  
  role: {
    type: String,
    enum: ['trainer', 'trainee'], // Added both roles
    default: 'trainee', // Default role is trainee
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
