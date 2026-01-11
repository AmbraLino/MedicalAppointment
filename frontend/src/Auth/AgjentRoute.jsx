import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const AgjentRoute = ({ children }) => {
  const { userInfo, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;
  if (!userInfo) return <Navigate to="/login" replace />;
  if (!(userInfo.role === "agent" && userInfo.email === "agjent@barkea.com")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AgjentRoute;
