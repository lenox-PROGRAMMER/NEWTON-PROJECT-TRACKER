const { Project, Student, Feedback } = require('../models');

// CREATE – Student submits a project
exports.createProject = async (req, res) => {
  try {
    const { title, description, githubLink } = req.body;
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const project = await Project.create({
      title,
      description,
      githubLink,
      studentId,
      status: 'submitted',
    });

    console.log('📦 New project submitted:', project.id);
    res.status(201).json(project);
  } catch (err) {
    console.error('🛑 Create project error:', err.message);
    res.status(400).json({ error: 'Failed to create project' });
  }
};

// READ – Admin fetches all projects with student info + feedback
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Feedback,
          as: 'feedback',
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(projects);
  } catch (err) {
    console.error('🛑 Fetch all projects error:', err.message);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// READ ONE – Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Feedback,
          as: 'feedback',
          required: false,
        },
      ],
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error('🛑 Fetch project by ID error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
};

// UPDATE – Admin updates project status or other info
exports.updateProject = async (req, res) => {
  try {
    const [updated] = await Project.update(req.body, {
      where: { id: req.params.id },
    });

    updated
      ? res.json({ message: 'Project updated successfully' })
      : res.status(404).json({ error: 'Project not found' });
  } catch (err) {
    console.error('🛑 Update project error:', err.message);
    res.status(400).json({ error: 'Failed to update project' });
  }
};

// DELETE – Admin deletes a project
exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.destroy({
      where: { id: req.params.id },
    });

    deleted
      ? res.json({ message: 'Project deleted successfully' })
      : res.status(404).json({ error: 'Project not found' });
  } catch (err) {
    console.error('🛑 Delete project error:', err.message);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// STUDENT – Get their own submissions
exports.getMyProjects = async (req, res) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const projects = await Project.findAll({
      where: { studentId },
      include: [
        {
          model: Feedback,
          as: 'feedback',
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    console.log(`📬 Fetched ${projects.length} projects for student ${studentId}`);
    res.json(projects);
  } catch (err) {
    console.error('🛑 Fetch my projects error:', err.message);
    res.status(500).json({ error: 'Failed to fetch your projects' });
  }
};
