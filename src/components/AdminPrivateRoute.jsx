import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}