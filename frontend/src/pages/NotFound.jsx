// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1>🚫 404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/">Back to Login</Link>
    </div>
  );
}
