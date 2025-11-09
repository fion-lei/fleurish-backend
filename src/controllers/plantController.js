const mongoose = require('mongoose');
const Plant = require('../models/Plant');
const User = require('../models/User');
const Garden = require('../models/Garden');
const Plot = require('../models/Plot');

const { Types } = require('mongoose');

// Internal helper to create a plant
const createPlantInternal = async (
  { growth = 0, plantType, userId, isPlanted = false },
  session = null
) => {
  const doc = {
    growth,
    plantType,
    userId,
    isPlanted
  };

  const options = session ? { session } : {};
  const [plant] = await Plant.create([doc], options);
  return plant;
};

// Create plant
exports.createPlant = async (req, res) => {
  try {
    const { growth, plantTypeId, userId, isPlanted } = req.body;

    if (!plantTypeId) {
      return res.status(400).json({
        success: false,
        error: 'plantTypeId is required'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const plant = await createPlantInternal({
      growth,
      plantType: plantTypeId,
      userId,
      isPlanted: isPlanted ?? false
    });

    const out = plant.toObject();
    out.plantId = out._id;

    return res.status(201).json({
      success: true,
      data: out
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
      error: error.message,
    });
  }
};

// Get plant by id
exports.getPlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.plantId).populate("plantType").populate("userId", "email");

    if (!plant) {
      return res.status(404).json({
        success: false,
        error: "Plant not found",
      });
    }

    const out = plant.toObject();
    out.plantId = out._id;

    return res.status(200).json({
      success: true,
      data: out,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get plants by userId with optional isPlanted filter
exports.getUserPlants = async (req, res) => {
  try {
    const { userId, isPlanted } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const query = { userId };

    // Add isPlanted filter if provided
    if (isPlanted !== undefined) {
      query.isPlanted = isPlanted === "true";
    }

    const plants = await Plant.find(query).populate("plantType").populate("userId", "email");

    const plantsWithId = plants.map((plant) => {
      const out = plant.toObject();
      out.plantId = out._id;
      return out;
    });

    return res.status(200).json({
      success: true,
      count: plantsWithId.length,
      data: plantsWithId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update plant
exports.updatePlant = async (req, res) => {
  try {
    const updates = {};

    if (req.body.growth !== undefined) updates.growth = req.body.growth;
    if (req.body.plantTypeId !== undefined) updates.plantType = req.body.plantTypeId;
    if (req.body.isPlanted !== undefined) updates.isPlanted = req.body.isPlanted;
    if (req.body.userId !== undefined) updates.userId = req.body.userId;

    const plant = await Plant.findByIdAndUpdate(req.params.plantId, updates, { new: true }).populate("plantType").populate("userId", "email");

    if (!plant) {
      return res.status(404).json({
        success: false,
        error: "Plant not found",
      });
    }

    const out = plant.toObject();
    out.plantId = out._id;

    return res.status(200).json({
      success: true,
      data: out,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Plant into next available plot
exports.plantInNextAvailablePlot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, plantId } = req.body;

    if (!userId || !plantId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "userId and plantId are required",
      });
    }

    // Load user
    const user = await User.findById(userId).session(session);
    if (!user || !user.gardenId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        error: "User or garden not found",
      });
    }

    // Load plant
    const plant = await Plant.findById(plantId).session(session);
    if (!plant) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        error: "Plant not found",
      });
    }

    // Ensure plant belongs to this user
    if (plant.userId.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        error: "Plant does not belong to this user",
      });
    }

    // Ensure plant is not already planted
    if (plant.isPlanted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "Plant is already planted",
      });
    }

    // Load garden with plots
    const garden = await Garden.findById(user.gardenId).populate("plots").session(session);

    if (!garden) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        error: "Garden not found",
      });
    }

    // Find first available plot (no plant)
    const availablePlot = garden.plots.find((p) => !p.plant);

    // If no available plot, cannot plant
    if (!availablePlot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "No available plots in garden",
      });
    }

    // Assign plant to plot & mark as planted
    availablePlot.plant = plant._id;
    await availablePlot.save({ session });

    plant.isPlanted = true;
    await plant.save({ session });

    await session.commitTransaction();
    session.endSession();

    const outPlant = plant.toObject();
    outPlant.plantId = outPlant._id;

    return res.status(200).json({
      success: true,
      data: {
        plant: outPlant,
        plot: {
          plotId: availablePlot._id,
          row: availablePlot.row,
          column: availablePlot.column,
          plant: availablePlot.plant,
        },
        gardenId: garden._id,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.removePlantFromPlot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, plantId } = req.body;

    // Basic body validation
    if (!userId || !plantId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "userId and plantId are required",
      });
    }

    // Validate ObjectId formats early
    if (!Types.ObjectId.isValid(plantId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "Invalid plantId format",
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "Invalid userId format",
      });
    }

    // Load plant
    const plant = await Plant.findById(plantId).session(session);

    if (!plant) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        error: `Plant not found for id ${plantId}`,
      });
    }

    // Ensure plant belongs to this user
    if (plant.userId.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        error: "Plant does not belong to this user",
      });
    }

    // Check conditions: growth = 2 and isPlanted = true
    if (plant.growth !== 2 || !plant.isPlanted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "Plant is not eligible to be removed from plot (must have growth = 2 and be planted)",
      });
    }

    // Find the plot that currently has this plant
    const plot = await Plot.findOne({ plant: plant._id }).session(session);

    if (!plot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        error: "No plot is associated with this plant",
      });
    }

    // Clear the plant from the plot
    plot.plant = null;
    await plot.save({ session });

    // Update plant state
    plant.isPlanted = false;
    await plant.save({ session });

    await session.commitTransaction();
    session.endSession();

    const outPlant = plant.toObject();
    outPlant.plantId = outPlant._id;

    return res.status(200).json({
      success: true,
      data: {
        plant: outPlant,
        plot: {
          plotId: plot._id,
          row: plot.row,
          column: plot.column,
          plant: plot.plant, // null
        },
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports.createPlantInternal = createPlantInternal;
