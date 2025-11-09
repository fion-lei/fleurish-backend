const Task = require("../models/Task");
const mongoose = require("mongoose");
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

    // Pick a random task description from the JSON file
    const randomDescription = taskDescriptions.litterTasks[Math.floor(Math.random() * taskDescriptions.litterTasks.length)];

    // Randomize task points between 5 and 15
    const randomPoints = Math.floor(Math.random() * 11) + 5;  

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
