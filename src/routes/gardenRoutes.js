const express = require("express");
const router = express.Router();
const { getGarden, addPlot, getGardenGrowthStatus, updateGardenName } = require("../controllers/gardenController");
const { protect } = require('../controllers/userController');


router.get("/:gardenId/growth", getGardenGrowthStatus);
router.get('/:gardenId', getGarden);
router.put('/:gardenId/plots', addPlot);
router.patch('/:gardenId/name', protect, updateGardenName);


module.exports = router;
