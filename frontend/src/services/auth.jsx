// src/services/auth.js

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

export function logout() {
  localStorage.removeItem('token');
}
