const Task = require("../models/Task");
const mongoose = require("mongoose");
const crypto = require("crypto");
const taskDescriptions = require("../../assets/taskDescriptions.json");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { taskName, taskDescription, taskPoints, status, requestUserId, completedUserId, communityId } = req.body;

    if (!requestUserId) {
      return res.status(400).json({
        success: false,
        error: "requestUserId is required",
      });
    }

    const randomIndex = crypto.randomInt(0, taskDescriptions.litterTasks.length);
    const randomDescription = taskDescriptions.litterTasks[randomIndex];

    // Randomize task points between 5 and 15 using crypto for better randomness
    const randomPoints = crypto.randomInt(5, 16); // 16 is exclusive, so max is 15

    const task = await Task.create({
      taskName: "Pick up litter",
      taskDescription: randomDescription,
      taskPoints: randomPoints,
      status,
      requestUserId,
      completedUserId,
      communityId: "690ff078e60625377ea99aee", // TODO: change this back to communityId, hardcoded for testing purposes
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create task",
    });
  }
};

// Get all tasks by community ID
exports.getTasksByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid community ID",
      });
    }

    const tasks = await Task.find({ communityId }).populate("requestUserId", "email").populate("completedUserId", "email").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks by community:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch tasks",
    });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid task ID",
      });
    }

    const task = await Task.findById(id).populate("completedUserId", "email").populate("communityId", "name");

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch task",
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate("completedUserId", "email").populate("communityId", "name");

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update task",
    });
  }
};

// Complete a task (update status and set completedUserId)
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid task ID",
      });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: "Valid user ID is required",
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      {
        status: "completed",
        completedUserId: userId,
      },
      { new: true, runValidators: true }
    )
      .populate("completedUserId", "email")
      .populate("communityId", "name");

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task marked as completed",
      data: task,
    });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to complete task",
    });
  }
};
