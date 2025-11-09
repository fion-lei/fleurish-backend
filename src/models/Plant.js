const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    growth: {
      type: Number,
      default: 0,
      min: 0,
      max: 100, // 0-33: stage 0, 34-66: stage 1, 67-100: stage 2
    },
    growthStage: {
      type: Number,
      default: 0,
      min: 0,
      max: 2, // 0, 1, or 2
    },
    plantType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantType",
      required: [true, "plantType is required"],
    },

    isPlanted: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },

    lastGrowthUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Middleware to update growth stage before saving
plantSchema.pre("save", function (next) {
  // Update growth stage based on growth value
  if (this.growth <= 33) {
    this.growthStage = 0;
  } else if (this.growth <= 66) {
    this.growthStage = 1;
  } else {
    this.growthStage = 2;
  }

  // Initialize lastGrowthUpdate when plant is first planted
  if (this.isModified("isPlanted") && this.isPlanted && !this.lastGrowthUpdate) {
    this.lastGrowthUpdate = new Date();
  }

  next();
});

module.exports = mongoose.model("Plant", plantSchema);
