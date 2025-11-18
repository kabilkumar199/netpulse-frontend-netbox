import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../../store/store";
import { ROUTES } from "../../../router/routes";

export const ProtectedRoute: React.FC = () => {
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Check if user is authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export const PublicRoute: React.FC = () => {
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // If user is already authenticated, redirect to dashboard
  if (token && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
