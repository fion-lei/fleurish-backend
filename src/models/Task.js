const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    trim: true
  },

  taskDescription: {
    type: String,
    trim: true
  },

  taskPoints: {
    type: Number,
    default: 0,
    min: [0, 'Task points cannot be negative']
  },

  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },

  requestID: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // User who completed the task (null until completed)
  completedUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Community this task belongs to
  communityID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate requestID if not provided
taskSchema.pre('validate', function (next) {
  if (!this.requestID) {
    this.requestID = `REQ_${new mongoose.Types.ObjectId().toString()}`;
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
