const express = require('express');
const router = express.Router();
const { getPlantType } = require('../controllers/plantTypeController');

router.get('/:plantTypeId', getPlantType);

module.exports = router;
