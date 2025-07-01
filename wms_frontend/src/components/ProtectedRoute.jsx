//  src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRoles = [], requiredPermissions = [] }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // ถ้าไม่มี token → กลับไป login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user?.role?.toLowerCase();
    const permissions = user?.permissions || [];

    const hasRole = requiredRoles.length === 0 || requiredRoles.includes(userRole);
    const hasPermission = requiredPermissions.length === 0 || requiredPermissions.some(p => permissions.includes(p));

    if (!hasRole || !hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }

    //  ผ่านทั้ง role และ permission
    return children;
  } catch (err) {
    console.error('Invalid user or permission format:', err);
    return <Navigate to="/login" replace />;
  }
}
