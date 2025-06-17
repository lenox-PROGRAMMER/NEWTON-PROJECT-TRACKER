const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { allowRoles } = require('../middlewares/roleGuard');

// 🔐 Protect admin-only routes
router.get(
  '/dashboard/admin',
  verifyToken,
  allowRoles('admin'),
  (req, res) => {
    res.status(200).json({ message: 'Welcome, admin!', user: req.user });
  }
);

// 🛠 Optional: fallback for unauthorized access could also live here
router.use((req, res) => {
  res.status(404).json({ error: 'Route not found in admin router' });
});

module.exports = router;
