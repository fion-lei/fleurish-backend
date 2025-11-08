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


exports.createUser = async (req, res) => {
  try {
    const {  email } = req.body;
    const newUser = new User({
      userId: generateUniqueId(), // Assume a function to generate unique IDs
      email,
      gems: 0,
      coins: 0
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }};