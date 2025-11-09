const { updateUserPlantsGrowth } = require("../services/growthService");

/**
 * Update growth for all planted plants belonging to a user
 * This should be called periodically by the frontend (e.g., every 10-30 seconds)
 * or when the user views their garden
 */
exports.updateGrowth = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const plantsUpdated = await updateUserPlantsGrowth(userId);

    res.status(200).json({
      success: true,
      plantsGrowthUpdates: plantsUpdated,
      message: plantsUpdated.length > 0 ? `${plantsUpdated.length} plant(s) updated` : "No plants ready for growth update",
    });
  } catch (error) {
    console.error("Error updating growth:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update plant growth",
    });
  }
};
