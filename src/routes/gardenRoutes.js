const express = require('express');
const router = express.Router();
const { createGarden, getGarden, addPlot } = require('../controllers/gardenController');

router.get('/:gardenId', getGarden);
router.post('/createGarden', createGarden);
router.put('/:gardenId/plots', addPlot);

module.exports = router;