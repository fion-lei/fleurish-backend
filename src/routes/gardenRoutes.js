const express = require("express");
const router = express.Router();
const { getGarden, addPlot, getGardenGrowthStatus } = require("../controllers/gardenController");

router.get("/:gardenId", getGarden);
router.get("/:gardenId/growth", getGardenGrowthStatus);
router.put("/:gardenId/plots", addPlot);

module.exports = router;
