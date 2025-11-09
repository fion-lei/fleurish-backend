const Plant = require('../models/Plant');

// Internal helper to create a plant
const createPlantInternal = async ({ growth = 0, plantType }) => {
  const plant = await Plant.create({ growth, plantType });
  return plant;
};

// Create plant (route)
exports.createPlant = async (req, res) => {
  try {
    // Accept explicit plantTypeId in body for clarity
    const { growth, plantTypeId } = req.body;
    if (!plantTypeId) return res.status(400).json({ success: false, error: 'plantTypeId is required' });

    const plant = await createPlantInternal({ growth, plantType: plantTypeId });
    const out = plant.toObject();
    out.plantId = out._id;
    res.status(201).json({ success: true, data: out });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get plant by id
exports.getPlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.plantId).populate('plantType');
    if (!plant) return res.status(404).json({ success: false, error: 'Plant not found' });
    const out = plant.toObject();
    out.plantId = out._id;
    res.status(200).json({ success: true, data: out });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update plant
exports.updatePlant = async (req, res) => {
  try {
    const updates = {};
    // Allow explicit plantTypeId in update body
    if (req.body.growth !== undefined) updates.growth = req.body.growth;
    if (req.body.plantTypeId !== undefined) updates.plantType = req.body.plantTypeId;

    const plant = await Plant.findByIdAndUpdate(req.params.plantId, updates, { new: true }).populate('plantType');
    if (!plant) return res.status(404).json({ success: false, error: 'Plant not found' });
    const out = plant.toObject();
    out.plantId = out._id;
    res.status(200).json({ success: true, data: out });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.createPlantInternal = createPlantInternal;
