const mongoose = require('mongoose');

const plantTypeSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  plantName: {
    type: String,
    trim: true,
    required: [true, 'plantName is required']
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
  _id: false // disable auto _id generation
});

module.exports = mongoose.model('PlantType', plantTypeSchema);
