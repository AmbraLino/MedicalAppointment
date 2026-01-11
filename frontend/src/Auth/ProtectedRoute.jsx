import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userInfo, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  if (!userInfo) return <Navigate to="/login" replace />;

  if (adminOnly && userInfo.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
