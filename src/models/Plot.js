const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  row: {
    type: Number,
    required: [true, 'Row is required']
  },
  column: {
    type: Number,
    required: [true, 'Column is required']
  },
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    default: null
  }
}, { 
  versionKey: false 
});

module.exports = mongoose.model('Plot', plotSchema);
