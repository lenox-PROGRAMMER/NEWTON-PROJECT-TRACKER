import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedPage({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || !isAuthenticated()) {
      return navigate('/', { replace: true });
    }

    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      // Role enforcement
      const roleToPath = {
        admin: '/admin-dashboard',
        student: '/student-dashboard',
      };

      const allowedPath = roleToPath[userRole];
      if (!allowedPath || location.pathname !== allowedPath && location.pathname !== '/profile') {
        return navigate('/', { replace: true });
      }

    } catch (err) {
      console.error('ProtectedPage: token decoding failed', err);
      navigate('/', { replace: true });
    }
  }, [navigate, location]);

  return <>{children}</>;
}
