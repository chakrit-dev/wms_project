import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Auth Pages
import UnifiedAuthLayout from './pages/UnifiedAuthLayout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Dashboard Layout + Pages
import DashboardLayout from './layouts/DashboardLayout';
import DashboardWelcome from './pages/dashboard/DashboardWelcome';
import Summary from './pages/dashboard/Summary';
import Products from './pages/dashboard/Products';
import Users from './pages/dashboard/Users';
import UserUpdateLogs from './pages/dashboard/UserUpdateLogs';
import Warehouses from './pages/dashboard/Warehouses';
import Inventories from './pages/dashboard/Inventories';
import Categories from './pages/dashboard/Categories';

// Receiving Pages
import ReceivingForm from './pages/dashboard/receiving/ReceivingForm';
import ReceivingList from './pages/dashboard/receiving/ReceivingList';
import ReceivingDetail from './pages/dashboard/receiving/ReceivingDetail';
import ReceivingEdit from './pages/dashboard/receiving/ReceivingEdit';

// Shipping Pages
import ShippingList from './pages/dashboard/shipping/ShippingList';
import ShippingForm from './pages/dashboard/shipping/ShippingForm';
import ShippingEdit from './pages/dashboard/shipping/ShippingEdit';
import ShippingDetail from './pages/dashboard/shipping/ShippingDetail';

// Common Components
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function AppWrapper() {
  const location = useLocation();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<UnifiedAuthLayout />} />
      <Route path="/register" element={<UnifiedAuthLayout />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboard Routes with Layout and Protection */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardWelcome />} />

        {/* Categories */}
        <Route
          path="categories"
          element={
            <ProtectedRoute requiredRoles={['admin', 'warehouse']}>
              <Categories />
            </ProtectedRoute>
          }
        />

        {/* Products */}
        <Route
          path="products"
          element={
            <ProtectedRoute requiredRoles={['admin', 'warehouse']}>
              <Products />
            </ProtectedRoute>
          }
        />

        {/* Users */}
        <Route
          path="users"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Warehouses */}
        <Route
          path="warehouses"
          element={
            <ProtectedRoute requiredRoles={['admin', 'warehouse']}>
              <Warehouses />
            </ProtectedRoute>
          }
        />

        {/* Inventories */}
        <Route
          path="inventories"
          element={
            <ProtectedRoute requiredRoles={['admin', 'warehouse']}>
              <Inventories />
            </ProtectedRoute>
          }
        />

        {/* ✅ Receiving Module */}
        <Route
          path="receivings"
          element={
            <ProtectedRoute requiredRoles={['admin', 'warehouse']}>
              <ReceivingList />
            </ProtectedRoute>
          }
        />
        <Route
          path="receivings/create"
          element={
            <ProtectedRoute requiredRoles={['admin', 'warehouse']}>
              <ReceivingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="receivings/:id"
          element={
            <ProtectedRoute requiredRoles={['admin', 'warehouse']}>
              <ReceivingDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="receivings/:id/edit"
          element={
            <ProtectedRoute requiredRoles={['admin', 'warehouse']}>
              <ReceivingEdit />
            </ProtectedRoute>
          }
        />

        {/* ✅ Shipping Module */}
        <Route
          path="shipping"
          element={
            <ProtectedRoute requiredRoles={['admin', 'delivery planning']}>
              <ShippingList />
            </ProtectedRoute>
          }
        />
        <Route
          path="shipping/new"
          element={
            <ProtectedRoute requiredRoles={['admin', 'delivery planning']}>
              <ShippingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="shipping/edit/:id"
          element={
            <ProtectedRoute requiredRoles={['admin', 'delivery planning']}>
              <ShippingEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="shipping/:id"
          element={
            <ProtectedRoute requiredRoles={['admin', 'delivery planning']}>
              <ShippingDetail />
            </ProtectedRoute>
          }
        />

        {/* Logs */}
        <Route
          path="user-logs"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <UserUpdateLogs />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Default Route & 404 Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppWrapper;
