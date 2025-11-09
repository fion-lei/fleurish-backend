const express = require('express');
const router = express.Router();
const { getGarden, addPlot } = require('../controllers/gardenController');

router.get('/:gardenId', getGarden);
router.put('/:gardenId/plots', addPlot);

module.exports = router;
