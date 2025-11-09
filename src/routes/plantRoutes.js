const express = require('express');
const router = express.Router();
const { createPlant, getPlant, updatePlant } = require('../controllers/plantController');

router.post('/createPlant', createPlant);
router.get('/:plantId', getPlant);
router.put('/:plantId', updatePlant);

module.exports = router;
