const express = require("express");
const router = express.Router();
const { createPlant, getPlant, getUserPlants, updatePlant, plantInNextAvailablePlot, removePlantFromPlot, deletePlant } = require("../controllers/plantController");

router.post("/plant-into-plot", plantInNextAvailablePlot);
router.post("/remove-from-plot", removePlantFromPlot);

router.get("/", getUserPlants);
router.post("/", createPlant);
router.get("/:plantId", getPlant);
router.patch("/:plantId", updatePlant);
router.delete("/:plantId", deletePlant);

module.exports = router;
