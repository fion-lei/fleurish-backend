const express = require('express');
const router = express.Router();
const { createPlot, getPlot, updatePlot } = require('../controllers/plotController');

router.get('/:plotId', getPlot);
router.post('/createPlot', createPlot);
router.put('/:plotId', updatePlot);

module.exports = router;
