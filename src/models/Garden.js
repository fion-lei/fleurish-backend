// models/Garden.js
const mongoose = require('mongoose');

const gardenSchema = new mongoose.Schema({
  plots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plot'
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Garden', gardenSchema);
