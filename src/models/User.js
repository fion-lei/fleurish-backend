// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  gardenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garden'
  },
  communityId: {
    type: String,
    trim: true
  },
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  gems: {
    type: Number,
    default: 0,
    min: [0, 'Gems cannot be negative']
  },
  coins: {
    type: Number,
    default: 0,
    min: [0, 'Coins cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
