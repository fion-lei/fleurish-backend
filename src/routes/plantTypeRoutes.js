const express = require('express');
const router = express.Router();
const { getPlantType } = require('../controllers/plantTypeController');

// plant types are created/managed manually in the database; only read access via API
router.get('/:plantTypeId', getPlantType);

module.exports = router;
