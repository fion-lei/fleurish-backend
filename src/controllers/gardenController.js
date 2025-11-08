const Garden = require('../models/Garden');

// @desc    Generate a unique garden ID
// @access  Private
const generateUniqueGardenID = async () => {
  const prefix = 'G'; // G for Garden
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const randomStr = Math.random().toString(36).substr(2, 5); // 5 random chars
  const proposedId = `${prefix}${timestamp}${randomStr}`.toUpperCase();
  
  // Check if ID already exists
  const existingGarden = await Garden.findOne({ gardenId: proposedId });
  if (existingGarden) {
    // If ID exists, try again recursively
    return generateUniqueGardenID();
  }
  
  return proposedId;
};

// @desc    Create new garden
// @route   POST /api/gardens
// @access  Private
exports.createGarden = async (req, res) => {
  try {
    const gardenId = await generateUniqueGardenID();
    
    const garden = await Garden.create({
      gardenId,
      plotArray: req.body.plotArray || []
    });

    res.status(201).json({
      success: true,
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get garden by ID
// @route   GET /api/gardens/:gardenId
// @access  Private
exports.getGarden = async (req, res) => {
  try {
    const garden = await Garden.findOne({ gardenId: req.params.gardenId });
    
    if (!garden) {
      return res.status(404).json({
        success: false,
        error: 'Garden not found'
      });
    }

    res.status(200).json({
      success: true,
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add plot to garden
// @route   PUT /api/gardens/:gardenId/plots
// @access  Private
exports.addPlot = async (req, res) => {
  try {
    const garden = await Garden.findOne({ gardenId: req.params.gardenId });
    
    if (!garden) {
      return res.status(404).json({
        success: false,
        error: 'Garden not found'
      });
    }

    // Add new plotId to plotArray if it doesn't already exist
    if (!garden.plotArray.includes(req.body.plotId)) {
      garden.plotArray.push(req.body.plotId);
      await garden.save();
    }

    res.status(200).json({
      success: true,
      data: garden
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};