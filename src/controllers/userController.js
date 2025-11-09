const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Garden = require('../models/Garden');
const Plot = require('../models/Plot');
const Plant = require('../models/Plant');

// Auth middleware - protect routes
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

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
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

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
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

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
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

exports.createUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // create initial plot
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

    // Create Garden with this plot
    const [garden] = await Garden.create(
      [
        {
          plots: [plot._id]
        }
      ],
      { session }
    );

    // Create User referencing Garden
    const [newUser] = await User.create(
      [
        {
          email,
          gems: 0,
          coins: 0,
          gardenId: garden._id,
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const userOut = newUser.toObject();
    userOut.userId = userOut._id;

    const gardenOut = garden.toObject();
    gardenOut.gardenId = gardenOut._id;

    return res.status(201).json({
      success: true,
      data: {
        user: {
          userId: userOut.userId,
          email: userOut.email,
          gems: userOut.gems,
          coins: userOut.coins
        },
        garden: gardenOut,
      }
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
