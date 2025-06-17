'use strict';

const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const { allowRoles } = require('../middlewares/roleGuard');
const feedbackController = require('../controllers/feedbackController');

// 📝 POST /api/feedback → Admin or Teacher submits feedback
router.post(
  '/',
  verifyToken,
  allowRoles('admin', 'teacher'),
  feedbackController.createFeedback
);

// 📬 GET /api/feedback/:projectId → Student/Admin/Teacher fetch feedback for a project
router.get(
  '/:projectId',
  verifyToken,
  allowRoles('student', 'admin', 'teacher'),
  feedbackController.getFeedbackByProject
);

module.exports = router;
