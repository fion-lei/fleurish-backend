const Plant = require("../models/Plant");
const PlantType = require("../models/PlantType");

/**
 * Update growth for all planted plants belonging to a user based on time elapsed
 * @param {string} userId - The user ID
 * @returns {Array} - Array of updated plants with their growth changes
 */
exports.updateUserPlantsGrowth = async (userId) => {
  try {
    // Find all planted plants for this user
    const plants = await Plant.find({
      userId,
      isPlanted: true,
      growth: { $lt: 100 }, // Only update plants that haven't reached max growth
    }).populate("plantType");

    if (!plants || plants.length === 0) {
      return [];
    }

    const updatedPlants = [];
    const now = new Date();

    for (const plant of plants) {
      const oldGrowth = plant.growth;
      const oldStage = plant.growthStage;

      // Calculate time elapsed since last update (in milliseconds)
      const lastUpdate = plant.lastGrowthUpdate || plant.createdAt;
      const timeElapsedMs = now - lastUpdate;
      const timeElapsedMinutes = timeElapsedMs / (1000 * 60);

      // Growth rate: 100 growth points per minute for growthMultiplier = 1.0
      // Formula: (100 growth points / 1 minute) * growthMultiplier * timeElapsedMinutes
      const growthIncrease = (100 / 1) * plant.plantType.growthMultiplier * timeElapsedMinutes;

      // Update growth (capped at 100)
      plant.growth = Math.min(100, plant.growth + growthIncrease);
      plant.lastGrowthUpdate = now;

      await plant.save(); // This will trigger the pre-save hook to update growthStage

      // Only include plants that actually changed stage or reached max
      if (plant.growthStage !== oldStage || plant.growth === 100) {
        updatedPlants.push({
          plantId: plant._id,
          oldStage,
          newStage: plant.growthStage,
          growth: plant.growth,
        });
      }
    }

    return updatedPlants;
  } catch (error) {
    console.error("Error updating plant growth:", error);
    throw error;
  }
};

/**
 * Get current growth status for all plants in a garden
 * @param {Array} plotIds - Array of plot IDs
 * @returns {Object} - Growth status information
 */
exports.getGardenGrowthStatus = async (plotIds) => {
  try {
    const Plot = require("../models/Plot");

    const plots = await Plot.find({ _id: { $in: plotIds } }).populate({
      path: "plant",
      populate: { path: "plantType" },
    });

    return plots.map((plot) => ({
      plotId: plot._id,
      row: plot.row,
      column: plot.column,
      plant: plot.plant
        ? {
            plantId: plot.plant._id,
            growth: plot.plant.growth,
            growthStage: plot.plant.growthStage,
            plantType: plot.plant.plantType,
          }
        : null,
    }));
  } catch (error) {
    console.error("Error getting garden growth status:", error);
    throw error;
  }
};
