import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { logout } from '../services/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [feedbackData, setFeedbackData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProjects();
    const interval = setInterval(fetchAllProjects, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      toast.error(' Failed to load projects.');
    }
  };

  const handleModerate = async (projectId, newStatus) => {
    try {
      await api.patch(`/projects/${projectId}`, { status: newStatus });
      toast.success(`Project marked as ${newStatus.toUpperCase()}`);
      fetchAllProjects();
    } catch (err) {
      console.error('Moderation error:', err);
      toast.error(' Could not update project status.');
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      toast.success('🗑 Project deleted successfully');
      fetchAllProjects();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(' Failed to delete project.');
    }
  };

  const handleFeedbackChange = (projectId, field, value) => {
    setFeedbackData(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
      },
    }));
  };

  const handleSubmitFeedback = async (projectId) => {
    const { text, rating } = feedbackData[projectId] || {};
    if (!text || !rating) return toast.warn('Fill in both comment and rating');

    try {
      await api.post('/feedback', { projectId, text, rating });
      toast.success(' Feedback submitted!');
      setFeedbackData(prev => ({
        ...prev,
        [projectId]: { ...prev[projectId], sent: true }
      }));
    } catch (err) {
      if (err?.response?.status === 409) {
        toast.warning(' Feedback already exists for this project.');
      } else {
        toast.error(' Failed to submit feedback.');
      }
      console.error('Feedback error:', err);
    }
  };

  const handleLogout = () => {
    logout();
    setTimeout(() => navigate('/register'), 100);
  };

  const filtered = projects.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchText =
      p.title.toLowerCase().includes(search) ||
      p.student?.name?.toLowerCase().includes(search);
    return matchStatus && matchText;
  });

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <h2>Admin Dashboard</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by title or student..."
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        {['all', 'submitted', 'approved', 'reviewed', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              marginRight: '0.5rem',
              background: statusFilter === status ? '#4f46e5' : '#ddd',
              color: statusFilter === status ? '#fff' : '#000',
              padding: '0.4rem 0.8rem',
            }}
          >
            {status}
          </button>
        ))}
      </div>

      <section className="project-list">
        <h3>Projects</h3>

        {filtered.length === 0 ? (
          <p>No matching projects.</p>
        ) : (
          <ul>
            {filtered.map(project => {
              const current = feedbackData[project.id] || {};
              const hasFeedback = Boolean(project.feedback || current.sent);

              return (
                <li
                  key={project.id}
                  style={{
                    background: '#f8fafc',
                    borderLeft: '6px solid #4f46e5',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: '10px',
                  }}
                >
                  <strong>{project.title}</strong> —{' '}
                  <em>Status: {project.status}</em>
                  <br />
                  <p>{project.description}</p>
                  <p>
                     <strong>{project.student?.name || 'Unknown'} ({project.student?.email})</strong>
                  </p>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginBottom: '0.5rem' }}
                  >
                    🔗 GitHub Link
                  </a>

                  <div>
                    <button onClick={() => handleModerate(project.id, 'approved')} style={{ marginRight: '0.5rem' }}>
                      Approve
                    </button>
                    <button onClick={() => handleModerate(project.id, 'rejected')} style={{ marginRight: '0.5rem' }}>
                      Reject
                    </button>
                    {(project.status === 'submitted' || project.status === 'rejected') && (
                      <button onClick={() => handleDelete(project.id)} style={{ color: 'red' }}>
                        🗑 Delete
                      </button>
                    )}
                  </div>

                  {/* 🔁 Feedback Section */}
                  {['reviewed', 'approved'].includes(project.status) && (
                    <div style={{ marginTop: '1rem' }}>
                      {hasFeedback ? (
                        <div>
                          <p style={{ color: '#0f5132' }}>
                            ✅ Feedback already submitted:
                          </p>
                          <blockquote style={{ borderLeft: '4px solid #4f46e5', paddingLeft: '1rem' }}>
                            {project.feedback?.text || current.text}
                          </blockquote>
                          <p><strong>Rating:</strong> {project.feedback?.rating || current.rating}</p>
                        </div>
                      ) : (
                        <>
                          <textarea
                            value={current.text || ''}
                            onChange={e => handleFeedbackChange(project.id, 'text', e.target.value)}
                            placeholder="Write feedback..."
                            style={{ width: '100%', height: '60px', marginBottom: '0.5rem' }}
                          />
                          <label>
                            Rating:{' '}
                            <select
                              value={current.rating || ''}
                              onChange={e => handleFeedbackChange(project.id, 'rating', e.target.value)}
                            >
                              <option value="">Select</option>
                              {[1, 2, 3, 4, 5].map(n => (
                                <option key={n} value={n}>{n}</option>
                              ))}
                            </select>
                          </label>
                          <button onClick={() => handleSubmitFeedback(project.id)} style={{ marginLeft: '1rem' }}>
                            Submit Feedback
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
