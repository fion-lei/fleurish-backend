const mongoose = require("mongoose");

const plotSchema = new mongoose.Schema(
  {
    row: {
      type: Number,
      required: true,
    },
    column: {
      type: Number,
      required: true,
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      default: null,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model("Plot", plotSchema);
