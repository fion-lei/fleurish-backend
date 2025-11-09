const Garden = require('../models/Garden');
const Plot = require('../models/Plot');

// Get garden by Mongo _id and populate plots -> plant -> plantType
exports.getGarden = async (req, res) => {
  try {
    const garden = await Garden.findById(req.params.gardenId).populate({
      path: 'plots',
      populate: { path: 'plant', populate: { path: 'plantType' } }
    });

    if (!garden) return res.status(404).json({ success: false, error: 'Garden not found' });
    res.status(200).json({ success: true, data: garden });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add an existing plot to a garden by passing { plotId: '<mongoId>' } in body
exports.addPlot = async (req, res) => {
  try {
    const { plotId } = req.body;
    if (!plotId) return res.status(400).json({ success: false, error: 'plotId is required' });

    const plot = await Plot.findById(plotId);
    if (!plot) return res.status(404).json({ success: false, error: 'Plot not found' });

    const garden = await Garden.findById(req.params.gardenId);
    if (!garden) return res.status(404).json({ success: false, error: 'Garden not found' });

    // prevent duplicates
    if (!garden.plots.includes(plot._id)) {
      garden.plots.push(plot._id);
      await garden.save();
    }

    const populated = await Garden.findById(garden._id).populate({ path: 'plots', populate: { path: 'plant', populate: { path: 'plantType' } } });

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.updateGardenName = async (req, res) => {
  try {
    const { gardenName } = req.body;

    if (!gardenName) {
      return res.status(400).json({
        success: false,
        error: 'gardenName is required'
      });
    }

    if (gardenName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'gardenName cannot be empty'
      });
    }

    const garden = await Garden.findByIdAndUpdate(
      req.params.gardenId,
      { gardenName: gardenName.trim() },
      { new: true, runValidators: true }
    ).populate({
      path: 'plots',
      populate: { path: 'plant', populate: { path: 'plantType' } }
    });

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
