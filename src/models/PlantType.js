const mongoose = require('mongoose');

const plantTypeSchema = new mongoose.Schema({
  plantName: {
    type: String,
    trim: true
  },
  growthMultiplier: {
    type: Number,
    required: [true, 'growthMultiplier is required']
  },
  price: {
    type: Number,
    required: [true, 'price is required']
  }
}, {
  versionKey: false,
});

module.exports = mongoose.model('PlantType', plantTypeSchema);
