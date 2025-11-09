const mongoose = require('mongoose');

const plantTypeSchema = new mongoose.Schema({
  plantTypeId: {
    type: String,
    trim: true,
    required: [true, 'plantTypeId is required']
    // intentionally not unique
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
  versionKey: false
});

module.exports = mongoose.model('PlantType', plantTypeSchema);
