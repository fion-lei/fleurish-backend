const express = require('express');
const router = express.Router();
const { getPoints } = require('../controllers/userController');

router.get('/:userId/points', getPoints);

module.exports = router;
