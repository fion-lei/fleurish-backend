const Plot = require('../models/Plot');

// Internal helper to create a plot (returns created plot doc)
const createPlotInternal = async ({ row, column, plantId }) => {
  // let MongoDB generate the _id; we don't set a separate plotId
  const plot = await Plot.create({ row, column, plantId });
  return plot;
};

// Express route handler: create plot
exports.createPlot = async (req, res) => {
  try {
    const { row, column, plantId } = req.body;
    // Convert row and column to numbers and validate
    const numRow = Number(row);
    const numColumn = Number(column);
    
    if (isNaN(numRow) || isNaN(numColumn)) {
      return res.status(400).json({ success: false, error: 'Row and column must be valid numbers' });
    }

    // Remove any extra quotes from plantId
    const cleanPlantId = plantId ? plantId.replace(/['"]+/g, '') : plantId;
    const plot = await createPlotInternal({ row: numRow, column: numColumn, plantId: cleanPlantId });
    res.status(201).json({ success: true, data: plot });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Express route handler: get plot by MongoDB _id
exports.getPlot = async (req, res) => {
  try {
    const plot = await Plot.findById(req.params.plotId);
    if (!plot) return res.status(404).json({ success: false, error: 'Plot not found' });
    res.status(200).json({ success: true, data: plot });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Express route handler: update plot (row/column/plantId)
exports.updatePlot = async (req, res) => {
  try {
    const updates = {};
    ['row', 'column', 'plantId'].forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

  const plot = await Plot.findByIdAndUpdate(req.params.plotId, updates, { new: true });
    if (!plot) return res.status(404).json({ success: false, error: 'Plot not found' });
    res.status(200).json({ success: true, data: plot });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Export internal helper for reuse by other controllers (e.g., gardenController)
module.exports.createPlotInternal = createPlotInternal;
