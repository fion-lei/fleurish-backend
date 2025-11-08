const express = require('express');
const router = express.Router();
const {createGarden, getGarden, addPlot} = require('../controllers/gardenController');


router.route('/').post(createGarden);

router.route('/:gardenId').get(getGarden);

router.route('/:gardenId/plots').put(addPlot);

module.exports = router;