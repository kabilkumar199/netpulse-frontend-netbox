import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { ROUTES } from "../../../router/routes";

export const ProtectedRoute: React.FC = () => {
  const { token, isAuthenticated } = useAuthStore();

  // Check if user is authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export const PublicRoute: React.FC = () => {
  const { token, isAuthenticated } = useAuthStore();

  // If user is already authenticated, redirect to dashboard
  if (token && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
