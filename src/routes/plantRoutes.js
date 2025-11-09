const express = require('express');
const router = express.Router();
const {createPlant, getPlant, updatePlant, plantInNextAvailablePlot} = require('../controllers/plantController');

router.post('/plant-into-plot', plantInNextAvailablePlot);
router.post('/', createPlant);
router.get('/:plantId', getPlant);
router.patch('/:plantId', updatePlant);

module.exports = router;
