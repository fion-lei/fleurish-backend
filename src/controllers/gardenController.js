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
    const out = garden.toObject();
    out.gardenId = out._id;
    res.status(200).json({ success: true, data: out });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.addPlot = async (req, res) => {
  try {

    const rawPlotId = req.body?.plotId ?? req.query?.plotId;
    if (!rawPlotId) return res.status(400).json({ success: false, error: 'plotId is required (in body or query)' });

    const plotId = String(rawPlotId).trim().replace(/^"+|"+$/g, '');

    const plot = await Plot.findById(plotId);
    if (!plot) return res.status(404).json({ success: false, error: 'Plot not found' });

    const garden = await Garden.findById(req.params.gardenId);
    if (!garden) return res.status(404).json({ success: false, error: 'Garden not found' });

    if (!garden.plots.includes(plot._id)) {
      garden.plots.push(plot._id);
      await garden.save();
    }

    const populated = await Garden.findById(garden._id).populate({ path: 'plots', populate: { path: 'plant', populate: { path: 'plantType' } } });
    const out = populated.toObject();
    out.gardenId = out._id;
    res.status(200).json({ success: true, data: out });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
