const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

// /me route: returns authenticated user's info
router.get('/me', authenticateToken, (req, res) => {
  const { userId, role } = req.user;
  res.json({ userId, role, message: `You are logged in as ${role}` });
});

// /protected route: used by Dashboard to test access
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Protected content for ${req.user.role} loaded successfully 🔐` });
});

module.exports = router;
