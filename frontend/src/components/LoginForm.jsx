import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { isAuthenticated } from '../services/auth';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      if (decoded.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (decoded.role === 'student') {
        navigate('/student-dashboard');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('🟢 Login attempt started');
    try {
      const res = await api.post('/auth/login', form);
      const token = res.data.token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      console.log('🔑 Logged in as:', decoded.role);

      if (decoded.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (decoded.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Login</h2>

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        autoComplete="current-password"
        required
      />

      <button type="submit">Login</button>
      {error && <p style={{ color: 'crimson', marginTop: '1rem' }}>{error}</p>}
    </form>
  );
}
