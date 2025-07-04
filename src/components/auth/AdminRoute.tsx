import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  // Add some debugging
  console.log('AdminRoute - user:', user?.email, 'isAdmin:', isAdmin, 'loading:', loading, 'pathname:', window.location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminRoute - No user, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    console.log('AdminRoute - User exists but not admin, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('AdminRoute - User is admin, rendering children');
  return <>{children}</>;
};