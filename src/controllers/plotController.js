const Plot = require("../models/Plot");
const Garden = require("../models/Garden");

// Internal helper to create a plot (returns created plot doc)
const createPlotInternal = async ({ row, column, plantId }) => {
  // let MongoDB generate the _id; we don't set a separate plotId
  const plot = await Plot.create({ row, column, plantId });
  return plot;
};

// Express route handler: create plot
exports.createPlot = async (req, res) => {
  try {
    const { row, column, plantId, gardenId } = req.body;

    // Validate gardenId is provided
    if (!gardenId) {
      return res.status(400).json({ success: false, error: "gardenId is required" });
    }

    // Convert row and column to numbers and validate
    const numRow = Number(row);
    const numColumn = Number(column);

    if (isNaN(numRow) || isNaN(numColumn)) {
      return res.status(400).json({ success: false, error: "Row and column must be valid numbers" });
    }

    // Clean plant id if provided
    const cleanPlant = plantId ? String(plantId).replace(/['"]+/g, "") : plantId;
    const plot = await createPlotInternal({ row: numRow, column: numColumn, plantId: cleanPlant });

    // Add plot to garden's plots array
    const garden = await Garden.findById(gardenId);
    if (!garden) {
      // Delete the created plot since garden doesn't exist
      await Plot.findByIdAndDelete(plot._id);
      return res.status(404).json({ success: false, error: "Garden not found" });
    }

    // Prevent duplicates
    if (!garden.plots.includes(plot._id)) {
      garden.plots.push(plot._id);
      await garden.save();
    }

    await plot.populate({ path: "plant", populate: { path: "plantType" } });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Express route handler: get plot by MongoDB _id
exports.getPlot = async (req, res) => {
  try {
    const plot = await Plot.findById(req.params.plotId).populate({ path: "plant", populate: { path: "plantType" } });
    if (!plot) return res.status(404).json({ success: false, error: "Plot not found" });
    res.status(200).json({ success: true, data: out });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Express route handler: update plot (row/column/plantId)
exports.updatePlot = async (req, res) => {
  try {
    const updates = {};
    ["row", "column", "plantId"].forEach((k) => {
      if (req.body[k] !== undefined) updates[k === "plantId" ? "plant" : k] = req.body[k];
    });
    const plot = await Plot.findByIdAndUpdate(req.params.plotId, updates, { new: true }).populate({ path: "plant", populate: { path: "plantType" } });
    if (!plot) return res.status(404).json({ success: false, error: "Plot not found" });
    res.status(200).json({ success: true, data: plot });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Export internal helper for reuse by other controllers (e.g., gardenController)
module.exports.createPlotInternal = createPlotInternal;
