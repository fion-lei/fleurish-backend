const mongoose = require('mongoose');
const User = require('../models/User');
const Garden = require('../models/Garden');
const Inventory = require('../models/Inventory');

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

    // Create Garden
    const [garden] = await Garden.create(
      [{ plots: [] }],
      { session }
    );

    // Create Inventory
    const [inventory] = await Inventory.create(
      [{ seedArray: [], harvestArray: [] }],
      { session }
    );

    // new user 
    const [newUser] = await User.create(
      [{
        email,
        gems: 0,
        coins: 0,
        gardenId: garden._id,
        inventoryId: inventory._id
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      data: {
        user: newUser,
        garden,
        inventory
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
