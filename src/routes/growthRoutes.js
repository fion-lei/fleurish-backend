const express = require("express");
const router = express.Router();
const { updateGrowth } = require("../controllers/growthController");

// Update growth for all planted plants of a user
router.post("/update/:userId", updateGrowth);

module.exports = router;
