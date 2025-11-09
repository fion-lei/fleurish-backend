const express = require("express");
const router = express.Router();
const { getPlantType, getAllPlantTypes } = require("../controllers/plantTypeController");

router.get("/", getAllPlantTypes);
router.get("/:plantTypeId", getPlantType);

module.exports = router;
