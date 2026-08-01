import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { ProtectedRoute } from './ProtectedRoute';
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  NotFoundPage,
  LowonganPage,
  LamaranPage,
  UserPage,
  BillingPage,
  PerusahaanPage,
  KampusPage,
  LevelUserPage,
} from '@/pages';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes (Umum untuk semua yang sudah login) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/lowongan" element={<LowonganPage />} />
          <Route path="/lamaran" element={<LamaranPage />} />
          
          <Route path="/users/:id" element={<DashboardPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/blog" element={<DashboardPage />} />
          <Route path="/settings" element={<DashboardPage />} />

          {/* Rute Khusus Admin */}
            <Route path="/user" element={<UserPage />} />
            <Route path="/master/perusahaan" element={<PerusahaanPage />} />
            <Route path="/master/kampus" element={<KampusPage />} />
            <Route path="/master/level-user" element={<LevelUserPage />} />
          
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
