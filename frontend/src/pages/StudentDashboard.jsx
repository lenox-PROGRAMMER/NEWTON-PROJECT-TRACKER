import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import api from '../services/api';
import { logout } from '../services/auth';

function StudentDashboard() {
  const [projects, setProjects] = useState([]);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [form, setForm] = useState({
    title: '',
    description: '',
    githubLink: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    try {
      if (!token) return navigate('/');
      const decoded = jwtDecode(token);
      if (decoded.role !== 'student') return navigate('/');
    } catch (err) {
      console.error('Token validation failed:', err);
      logout();
      navigate('/');
    }
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/me');
      setProjects(res.data);
      res.data.forEach((project) => fetchFeedback(project.id));
    } catch (err) {
      console.error('Fetch projects error:', err);
      navigate('/');
    }
  };

  const fetchFeedback = async (projectId) => {
    try {
      const res = await api.get(`/feedback/${projectId}`);
      setFeedbackMap((prev) => ({ ...prev, [projectId]: res.data }));
    } catch (err) {
      // Feedback not yet submitted — no problem
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', form);
      alert('✅ Project submitted!');
      setForm({ title: '', description: '', githubLink: '' });
      await fetchProjects();
    } catch (err) {
      console.error('Submission error:', err);
      alert('❌ Failed to submit. Check console.');
    }
  };

  const handleLogout = () => {
    logout();
    setTimeout(() => navigate('/register'), 100);
  };

  const renderStatusBadge = (status) => {
    const colors = {
      approved: '#10b981',
      rejected: '#ef4444',
      reviewed: '#facc15',
      submitted: '#94a3b8',
    };
    return (
      <span
        style={{
          background: colors[status] || '#ccc',
          color: 'white',
          padding: '0.3rem 0.8rem',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '0.8rem',
        }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const renderFeedback = (projectId) => {
    const feedback = feedbackMap[projectId];
    if (!feedback) return null;

    const teacherName = feedback.teacher?.name;
    const teacherEmail = feedback.teacher?.email;

    return (
      <div style={{ marginTop: '0.5rem' }}>
        <p>
          💬 <em>{feedback.text}</em>
        </p>
        <p>
          ⭐ {'⭐'.repeat(feedback.rating)}{' '}
          <small style={{ fontStyle: 'italic' }}>
            {teacherName ? `by ${teacherName}` : ''}
            {teacherEmail ? ` (${teacherEmail})` : ''}
          </small>
        </p>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <h2>🎓 Student Dashboard</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <label>
          <input
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <input
            name="githubLink"
            placeholder="GitHub Link"
            value={form.githubLink}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit Project</button>
      </form>

      <div className="project-list">
        <h3>📦 Your Projects</h3>
        {projects.length === 0 ? (
          <p>No projects submitted yet.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li
                key={project.id}
                style={{
                  background: '#f9fafb',
                  borderLeft: '5px solid #4f46e5',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              >
                <strong>{project.title}</strong> {renderStatusBadge(project.status)}
                <p style={{ margin: '0.5rem 0' }}>{project.description}</p>
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔗 GitHub Link
                </a>
                <br />
                <small>Submitted on {new Date(project.createdAt).toLocaleDateString()}</small>
                {renderFeedback(project.id)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default StudentDashboard;
