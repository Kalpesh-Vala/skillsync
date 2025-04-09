const express = require('express');
const { verifyToken, verifyRefreshToken } = require('../middleware/auth');
const {
  register,
  login,
  refresh,
  logout
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/refresh', verifyRefreshToken, refresh);
router.post('/logout', verifyToken, logout);

module.exports = router;