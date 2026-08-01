import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { LoadingSpinner } from '@/components/common';

export interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  // console.log('user',user)

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cek apakah role pengguna saat ini diizinkan
  if (allowedRoles && allowedRoles.length > 0) {
    // Normalisasi role menjadi lowercase agar lebih aman saat pencocokan
    const userRole = user?.role?.toLowerCase();
    const hasRequiredRole = allowedRoles.some((role) => role.toLowerCase() === userRole);

    if (!hasRequiredRole) {
      // Jika role tidak sesuai, lempar kembali ke dashboard (atau halaman unauthorized)
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
