// src/controllers/communityController.js
const Community = require('../models/Community');

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
