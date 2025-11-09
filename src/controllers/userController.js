const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Garden = require('../models/Garden');
const Plot = require('../models/Plot');
const Plant = require('../models/Plant');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token'
    });
  }
};

exports.protect = protect;

exports.register = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    const [plot] = await Plot.create(
      [
        {
          row: 0,
          column: 0,
          plant: null
        }
      ],
      { session }
    );

    const [garden] = await Garden.create(
      [
        {
          plots: [plot._id]
        }
      ],
      { session }
    );

    const [newUser] = await User.create(
      [
        {
          email,
          password,
          gems: 0,
          coins: 0,
          gardenId: garden._id
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const token = newUser.generateAuthToken();

    res.status(201).json({
      success: true,
      token,
      data: {
        user: {
          userId: newUser._id,
          email: newUser.email,
          gems: newUser.gems,
          coins: newUser.coins,
          gardenId: newUser.gardenId
        }
      }
    });
  } catch (error) {
    // Only abort if transaction is still active
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating user',
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          userId: user._id,
          email: user.email,
          gems: user.gems,
          coins: user.coins,
          gardenId: user.gardenId
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging in',
      message: error.message
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('gardenId');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const plants = await Plant.find({ userId: user._id })
      .populate('plantType');

    res.status(200).json({
      success: true,
      data: {
        user: {
          userId: user._id,
          email: user.email,
          gems: user.gems,
          coins: user.coins,
          gardenId: user.gardenId,
          communityId: user.communityId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        plants: plants
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user data',
      message: error.message
    });
  }
};

// Get all users (returns user IDs and garden IDs)
// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id gardenId communityId coins gems');

    res.status(200).json({
      success: true,
      data: {
        users: users.map(user => ({
          userId: user._id,
          gardenId: user.gardenId,
          communityId: user.communityId,
          coins: user.coins,
          gems: user.gems
        }))
      }
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching users',
      message: error.message
    });
  }
};

// coin management

exports.addCoins = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'userId and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { coins: amount } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        coins: user.coins
      }
    });
  } catch (error) {
    console.error('addCoins error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error adding coins',
      message: error.message
    });
  }
};

// Remove coins
// POST /api/users/coins/remove
// Body: { userId, amount }
exports.removeCoins = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'userId and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    // Atomic: only update if user has enough coins
    const user = await User.findOneAndUpdate(
      { _id: userId, coins: { $gte: amount } },
      { $inc: { coins: -amount } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'User not found or insufficient coins'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        coins: user.coins
      }
    });
  } catch (error) {
    console.error('removeCoins error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error removing coins',
      message: error.message
    });
  }
};

// Add gems
// POST /api/users/gems/add
// Body: { userId, amount }
exports.addGems = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'userId and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { gems: amount } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        gems: user.gems
      }
    });
  } catch (error) {
    console.error('addGems error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error adding gems',
      message: error.message
    });
  }
};

// Remove gems
// POST /api/users/gems/remove
// Body: { userId, amount }
exports.removeGems = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'userId and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    // Atomic: only update if user has enough gems
    const user = await User.findOneAndUpdate(
      { _id: userId, gems: { $gte: amount } },
      { $inc: { gems: -amount } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'User not found or insufficient gems'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        gems: user.gems
      }
    });
  } catch (error) {
    console.error('removeGems error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error removing gems',
      message: error.message
    });
  }
};
