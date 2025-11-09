const express = require('express');
const router = express.Router();
const {
  createPlant,
  getPlant,
  updatePlant,
  plantInNextAvailablePlot,
  removePlantFromPlot
} = require('../controllers/plantController');

router.post('/plant-into-plot', plantInNextAvailablePlot);
router.post('/remove-from-plot', removePlantFromPlot);

router.post('/', createPlant);
router.get('/:plantId', getPlant);
router.patch('/:plantId', updatePlant);

module.exports = router;
