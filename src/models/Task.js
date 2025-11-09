const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
      trim: true,
    },

    taskDescription: {
      type: String,
      trim: true,
    },

    taskPoints: {
      type: Number,
      default: 0,
      min: [0, "Task points cannot be negative"],
    },

    status: {
      type: String,
      enum: ["new", "in_progress", "completed"],
      default: "new",
    },

    // User who requested the task
    requestUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // User who completed the task (null until completed)
    completedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Community this task belongs to
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
