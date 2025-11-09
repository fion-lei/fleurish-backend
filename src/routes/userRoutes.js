const express = require('express');
const router = express.Router();
const { register, login, getMe, createUser, protect } = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Legacy route (if needed)
router.post('/createUser', createUser);

module.exports = router;
