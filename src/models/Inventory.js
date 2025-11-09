// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  seedArray: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    }
  ],
  harvestArray: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    }
  ]
}, {
  timestamps: false,
  versionKey: false
});

module.exports = mongoose.model('Inventory', inventorySchema);
