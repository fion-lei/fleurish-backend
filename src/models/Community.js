// src/models/Community.js
const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  communityName: {
    type: String,
    required: true,
    trim: true
  },

  communityPoints: {
    type: Number,
    default: 0,
    min: [0, 'Community points cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Community', communitySchema);
