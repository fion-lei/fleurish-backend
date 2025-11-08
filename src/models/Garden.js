const mongoose = require('mongoose');

const gardenSchema = new mongoose.Schema({
  gardenId: {
    type: String,
    required: [true, 'Garden ID is required'],
    unique: true,
    trim: true
  },
  plotArray: [{
    type: String,  // Will store plotIDs
    ref: 'Plot',   // Reference to Plot model
    trim: true
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Garden', gardenSchema);