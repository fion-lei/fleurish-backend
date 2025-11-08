const express = require('express');
const router = express.Router();
const { getPoints, createUser } = require('../controllers/userController');

router.get('/:userId/points', getPoints);
router.post('/createUser', createUser);



module.exports = router;
