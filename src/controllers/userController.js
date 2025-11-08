const User = require('../models/User');

// @desc    Generate a unique user ID
// @access  Private
const generateUniqueId = async () => {
  const prefix = 'U'; // U for User
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const randomStr = Math.random().toString(36).substr(2, 5); // 5 random chars
  const proposedId = `${prefix}${timestamp}${randomStr}`.toUpperCase();
  
  // Check if ID already exists
  const existingUser = await User.findOne({ userId: proposedId });
  if (existingUser) {
    // If ID exists, try again recursively
    return generateUniqueId();
  }
  
  return proposedId;
};

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