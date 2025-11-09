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
  plantId: {
    type: String,
    trim: true
  }
}, { 
  versionKey: false  // This removes the __v field
});

module.exports = mongoose.model('Plot', plotSchema);
