// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div>
      <h2>👤 My Profile</h2>
      {user ? (
        <ul>
          <li>User ID: {user.userId}</li>
          <li>Role: {user.role}</li>
          <li>Email: {user.email}</li>
        </ul>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}
