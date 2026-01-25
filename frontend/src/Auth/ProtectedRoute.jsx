import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { userInfo, loading } = useContext(UserContext);

  if (loading) return <div className="text-center mt-5">Duke u ngarkuar...</div>;

  // Nëse nuk është i loguar, dërgoje te Login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Nëse roli i përdoruesit nuk është në listën e lejuar, dërgoje në Home
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;