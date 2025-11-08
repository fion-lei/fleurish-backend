const User = require('../models/User');

// @desc    Get user points (gems and coins)
// @route   GET /api/users/:userId/points
// @access  Public
exports.getPoints = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        gems: user.gems,
        coins: user.coins
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
