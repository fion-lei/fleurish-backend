const PlantType = require('../models/PlantType');

// Create plant type
exports.createPlantType = async (req, res) => {
  try {
    const { plantTypeId, growthMultiplier, price } = req.body;
    if (!plantTypeId || growthMultiplier === undefined || price === undefined) {
      return res.status(400).json({ success: false, error: 'plantTypeId, growthMultiplier and price are required' });
    }

    const pt = await PlantType.create({ plantTypeId, growthMultiplier, price });
    res.status(201).json({ success: true, data: pt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get plant type by id (Mongo _id)
exports.getPlantType = async (req, res) => {
  try {
    const pt = await PlantType.findById(req.params.plantTypeId);
    if (!pt) return res.status(404).json({ success: false, error: 'PlantType not found' });
    const out = pt.toObject();
    out.plantTypeMongoId = out._id;
    res.status(200).json({ success: true, data: out });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all plant types
exports.getAllPlantTypes = async (req, res) => {
  try {
    const plantTypes = await PlantType.find({});
    const data = plantTypes.map((pt) => {
      const out = pt.toObject();
      out.plantTypeMongoId = out._id;
      return out;
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update plant type
exports.updatePlantType = async (req, res) => {
  try {
    const updates = {};
    ['plantTypeId', 'growthMultiplier', 'price'].forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const pt = await PlantType.findByIdAndUpdate(req.params.plantTypeId, updates, { new: true });
    if (!pt) return res.status(404).json({ success: false, error: 'PlantType not found' });
    const out = pt.toObject();
    out.plantTypeMongoId = out._id;
    res.status(200).json({ success: true, data: out });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
