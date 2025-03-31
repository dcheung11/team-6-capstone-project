// Author: Damien Cheung
// Description: This file contains the PrivateRoute component, which is used to protect routes that require authentication.
// Last Modified: 2025-02-19

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
