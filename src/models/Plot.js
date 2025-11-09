const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema(
  {
    row: {
      type: Number,
      required: true,
      min: 0
    },
    column: {
      type: Number,
      required: true,
      min: 0
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      default: null
    }
  },
  {
    timestamps: false
  }
);

module.exports = mongoose.model('Plot', plotSchema);
