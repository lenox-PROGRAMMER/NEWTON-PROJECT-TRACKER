'use strict';

const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const { allowRoles } = require('../middlewares/roleGuard');
const projectController = require('../controllers/projectController');

// 🎓 Student routes
router.get(
  '/me',
  verifyToken,
  allowRoles('student'),
  projectController.getMyProjects
);

router.post(
  '/',
  verifyToken,
  allowRoles('student'),
  projectController.createProject
);

// 🧑‍💼 Admin-only routes
router.get(
  '/',
  verifyToken,
  allowRoles('admin'),
  projectController.getAllProjects
);

router.patch(
  '/:id',
  verifyToken,
  allowRoles('admin'),
  projectController.updateProject
);

router.delete(
  '/:id',
  verifyToken,
  allowRoles('admin'),
  projectController.deleteProject
);

// 🌐 Shared route (student/admin/teacher can view by ID)
router.get(
  '/:id',
  verifyToken,
  allowRoles('student', 'admin', 'teacher'),
  projectController.getProjectById
);

module.exports = router;
