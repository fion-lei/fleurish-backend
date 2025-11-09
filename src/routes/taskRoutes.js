const express = require("express");
const router = express.Router();
const { createTask, getTaskById, updateTask, completeTask, getTasksByCommunity, getTasksByUserId } = require("../controllers/taskController");

// Task CRUD routes
router.post("/", createTask);
router.get("/community/:communityId", getTasksByCommunity);
router.get("/user/:userId", getTasksByUserId);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);

// Special route for completing tasks
router.patch("/:id/complete", completeTask);

module.exports = router;
