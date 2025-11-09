const Plant = require('../models/Plant');

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
// Body: { plantTypeId, userId, growth?, isPlanted? }
exports.createPlant = async (req, res) => {
  try {
    const { growth, plantTypeId, userId, isPlanted } = req.body;

    if (!plantTypeId) {
      return res
        .status(400)
        .json({ success: false, error: 'plantTypeId is required' });
    }

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: 'userId is required' });
    }

    const plant = await createPlantInternal({
      growth,
      plantType: plantTypeId,
      userId,
      isPlanted: isPlanted ?? false
    });

    const out = plant.toObject();
    out.plantId = out._id;

    return res.status(201).json({ success: true, data: out });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error.message });
  }
};

// Get plant by id
exports.getPlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.plantId)
      .populate('plantType')
      .populate('userId', 'email');

    if (!plant) {
      return res
        .status(404)
        .json({ success: false, error: 'Plant not found' });
    }

    const out = plant.toObject();
    out.plantId = out._id;

    return res.status(200).json({ success: true, data: out });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error.message });
  }
};

// Update plant
exports.updatePlant = async (req, res) => {
  try {
    const updates = {};

    if (req.body.growth !== undefined) {
      updates.growth = req.body.growth;
    }

    if (req.body.plantTypeId !== undefined) {
      updates.plantType = req.body.plantTypeId;
    }

    if (req.body.isPlanted !== undefined) {
      updates.isPlanted = req.body.isPlanted;
    }

    if (req.body.userId !== undefined) {
      updates.userId = req.body.userId;
    }

    const plant = await Plant.findByIdAndUpdate(
      req.params.plantId,
      updates,
      { new: true }
    )
      .populate('plantType')
      .populate('userId', 'email');

    if (!plant) {
      return res
        .status(404)
        .json({ success: false, error: 'Plant not found' });
    }

    const out = plant.toObject();
    out.plantId = out._id;

    return res.status(200).json({ success: true, data: out });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error.message });
  }
};

module.exports.createPlantInternal = createPlantInternal;
