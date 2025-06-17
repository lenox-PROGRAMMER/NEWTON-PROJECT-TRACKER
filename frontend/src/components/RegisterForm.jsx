import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    grade: '',
    email: '',
    password: '',
    role: 'student', // always student
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded?.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (decoded?.role === 'student') {
          navigate('/student-dashboard');
        }
      }
    } catch (err) {
      console.error('Invalid or expired token:', err);
      localStorage.removeItem('token');
    }
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setMessage('🎉 Registration successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Registration failed:', err);
      setMessage('❌ Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Register</h2>

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        value={form.name}
        required
      />

      <input
        name="grade"
        placeholder="Grade"
        onChange={handleChange}
        value={form.grade}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        value={form.email}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        value={form.password}
        required
      />

      <button type="submit">Register</button>

      {message && <p>{message}</p>}

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already registered? <Link to="/">Log in here</Link>
      </p>
    </form>
  );
}
