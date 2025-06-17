import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ProtectedPage from './components/ProtectedPage';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Protected Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedPage>
            <AdminDashboard />
          </ProtectedPage>
        }
      />
      <Route
        path="/student-dashboard"
        element={
          <ProtectedPage>
            <StudentDashboard />
          </ProtectedPage>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedPage>
            <Profile />
          </ProtectedPage>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
