// src/controllers/communityController.js
const Community = require('../models/Community');
const User = require('../models/User');

// GET top 5 communities by points
exports.getTopCommunities = async (req, res) => {
  try {
    const topCommunities = await Community.find({})
      .sort({ communityPoints: -1 })
      .limit(5)
      .select('communityName communityPoints');

    const leaderboard = topCommunities.map((community, index) => ({
      rank: index + 1,
      _id: community._id,
      communityName: community.communityName,
      communityPoints: community.communityPoints
    }));

    return res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET user's community rank (protected route)
exports.getUserCommunityRank = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user._id);
    
    if (!user || !user.communityId) {
      return res.status(404).json({
        success: false,
        error: 'User has no community assigned'
      });
    }

    // Get user's community details
    const userCommunity = await Community.findById(user.communityId);
    
    if (!userCommunity) {
      return res.status(404).json({
        success: false,
        error: 'Community not found'
      });
    }

    // Count how many communities have more points
    const rank = await Community.countDocuments({
      communityPoints: { $gt: userCommunity.communityPoints }
    }) + 1;

    return res.status(200).json({
      success: true,
      data: {
        rank: rank,
        _id: userCommunity._id,
        communityName: userCommunity.communityName,
        communityPoints: userCommunity.communityPoints
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET combined leaderboard (top 5 + user's rank if not in top 5)
exports.getLeaderboardWithUserRank = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get top 5
    const topCommunities = await Community.find({})
      .sort({ communityPoints: -1 })
      .limit(5)
      .select('communityName communityPoints');

    const leaderboard = topCommunities.map((community, index) => ({
      rank: index + 1,
      _id: community._id,
      communityName: community.communityName,
      communityPoints: community.communityPoints
    }));

    let userCommunityRank = null;

    if (user && user.communityId) {
      const userCommunity = await Community.findById(user.communityId);
      
      if (userCommunity) {
        const rank = await Community.countDocuments({
          communityPoints: { $gt: userCommunity.communityPoints }
        }) + 1;

        // Only include if user's community is NOT in top 5
        if (rank >= 5) {
          userCommunityRank = {
            rank: rank,
            _id: userCommunity._id,
            communityName: userCommunity.communityName,
            communityPoints: userCommunity.communityPoints
          };
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        topCommunities: leaderboard,
        userCommunityRank: userCommunityRank
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find({}, 'communityName communityPoints');
    return res.status(200).json({
      success: true,
      data: communities
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET single community by ID
exports.getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id, 'communityName communityPoints');
    if (!community) {
      return res.status(404).json({
        success: false,
        error: 'Community not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: community
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPDATE communityPoints (set to a new value)
exports.updateCommunityPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { communityPoints } = req.body;

    if (communityPoints === undefined || isNaN(communityPoints)) {
      return res.status(400).json({
        success: false,
        error: 'communityPoints (number) is required'
      });
    }

    const updated = await Community.findByIdAndUpdate(
      id,
      { communityPoints },
      { new: true, runValidators: true, fields: 'communityName communityPoints' }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Community not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
