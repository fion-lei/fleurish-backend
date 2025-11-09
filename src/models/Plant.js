const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    growth: {
      type: Number,
      default: 0,
      min: 0
    },
    plantType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlantType',
      required: [true, 'plantType is required']
    },
    
    isPlanted: {
      type: Boolean,
      default: false
    },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required']
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Plant', plantSchema);
