const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  growth: {
    type: Number,
    default: 0
  },
  plantType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlantType',
    required: [true, 'plantType is required']
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Plant', plantSchema);
