// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';

// Public pages (with Navbar)
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HallListingPage from '../pages/HallListingPage';
import HallDetailsPage from '../pages/HallDetailsPage';
import BookingSuccessPage from '../pages/BookingSuccessPage';
import NotFoundPage from '../pages/NotFoundPage';

// Dashboard layout
import DashboardLayout from '../layouts/DashboardLayout';

// User dashboard pages
import UserDashboard from '../pages/UserDashboard';
import UserBookingsPage from '../pages/UserBookingsPage';
import ProfilePage from '../pages/ProfilePage';

// Admin dashboard pages
import AdminDashboard from '../pages/AdminDashboard';
import ManageHallsPage from '../pages/ManageHallsPage';
import ManageBookingsPage from '../pages/ManageBookingsPage';
import AdminUsersPage from '../pages/AdminUsersPage';

const AppRoutes = () => (
  <Routes>
    {/* ── Public Routes ─────────────────────────────────── */}
    <Route path="/" element={<HomePage />} />
    <Route path="/halls" element={<HallListingPage />} />
    <Route path="/halls/:id" element={<HallDetailsPage />} />
    <Route
      path="/booking-success"
      element={
        <ProtectedRoute>
          <BookingSuccessPage />
        </ProtectedRoute>
      }
    />

    {/* ── Auth Routes (redirect if logged in) ───────────── */}
    <Route
      path="/login"
      element={
        <PublicOnlyRoute>
          <LoginPage />
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicOnlyRoute>
          <RegisterPage />
        </PublicOnlyRoute>
      }
    />

    {/* ── User Dashboard ────────────────────────────────── */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<UserDashboard />} />
      <Route path="bookings" element={<UserBookingsPage />} />
    </Route>

    {/* Profile (accessible from both user and admin layouts) */}
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<ProfilePage />} />
    </Route>

    {/* ── Admin Dashboard ───────────────────────────────── */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute adminOnly>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="halls" element={<ManageHallsPage />} />
      <Route path="bookings" element={<ManageBookingsPage />} />
      <Route path="users" element={<AdminUsersPage />} />
    </Route>

    {/* ── Fallback ──────────────────────────────────────── */}
    <Route path="/404" element={<NotFoundPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
