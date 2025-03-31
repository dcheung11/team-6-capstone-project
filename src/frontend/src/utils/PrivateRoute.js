import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

// PrivateRoute component: A wrapper for routes that require authentication
const PrivateRoute = () => {
  const user = useAuth();
  if (!user.token) return <Navigate to="/" />;
  return <Outlet />;
};

export default PrivateRoute;
