// src/routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const {getAllCommunities, getCommunityById, updateCommunityPoints} = require('../controllers/communityController');

router.get('/', getAllCommunities);
router.get('/:id', getCommunityById);
router.patch('/:id/points', updateCommunityPoints);

module.exports = router;
