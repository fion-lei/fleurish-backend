// src/routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllCommunities,
  getCommunityById,
  getCommunityName,
  updateCommunityPoints,
  getTopCommunities,
  getUserCommunityRank,
  getLeaderboardWithUserRank
} = require('../controllers/communityController');
const { protect } = require('../controllers/userController');

// Public routes
router.get('/', getAllCommunities);
router.get('/leaderboard/top', getTopCommunities);
router.post('/name', getCommunityName);

// Protected routes (require authentication)
router.get('/leaderboard/me', protect, getUserCommunityRank);
router.get('/leaderboard/combined', protect, getLeaderboardWithUserRank);

router.get('/:id', getCommunityById);
router.patch('/:id/points', updateCommunityPoints);

module.exports = router;
