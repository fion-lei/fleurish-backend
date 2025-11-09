const mongoose = require('mongoose');
const User = require('../models/User');
const Garden = require('../models/Garden');
const Plot = require('../models/Plot');

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
          plantID: null
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
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
