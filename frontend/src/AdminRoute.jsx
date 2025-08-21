import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = () => {
  const token = localStorage.getItem('access');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    // Django's 'is_staff' flag is used for admin access
    const isAdmin = decoded.is_staff;

    // Check if token is expired (optional but recommended)
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;