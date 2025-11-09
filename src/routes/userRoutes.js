const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, addCoins, addGems, removeCoins, removeGems, protect } = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/', getAllUsers);

// coin management
router.post('/coins/add', addCoins);
router.post('/coins/remove', removeCoins);
router.post('/gems/add', addGems);
router.post('/gems/remove', removeGems);


module.exports = router;
