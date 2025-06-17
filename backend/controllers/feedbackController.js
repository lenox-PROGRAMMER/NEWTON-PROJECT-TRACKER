const { Feedback, Project, Teacher } = require('../models');

// 🔁 POST – Admin or Teacher gives feedback
exports.createFeedback = async (req, res) => {
  try {
    const { text, rating, projectId } = req.body;
    const instructorId = req.user?.id;

    if (!projectId || !text || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 🔍 Validate project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // 🚫 Prevent duplicate feedback
    const existing = await Feedback.findOne({ where: { projectId } });
    if (existing) {
      return res.status(409).json({ error: 'Feedback already exists for this project' });
    }

    // ✅ Create feedback
    const feedback = await Feedback.create({
      text,
      rating,
      projectId,
      instructorId,
      studentId: project.studentId,
    });

    console.log(`📝 Feedback submitted for project ${projectId}`);
    res.status(201).json(feedback);
  } catch (err) {
    console.error('🛑 Create feedback error:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// 📬 GET – Fetch feedback for a specific project (student view)
exports.getFeedbackByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const feedback = await Feedback.findOne({
      where: { projectId },
      include: [{
  model: Teacher,
  as: 'teacher', 
  attributes: ['name', 'email']
}]

    });

    if (!feedback) {
      return res.status(404).json({ error: 'No feedback yet for this project' });
    }

    res.status(200).json(feedback);
  } catch (err) {
    console.error('🛑 Fetch feedback error:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};
