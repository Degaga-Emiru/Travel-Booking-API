import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Hotels from './pages/Hotels';
import Flights from './pages/Flights';
import Packages from './pages/Packages';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import CityDetail from './pages/CityDetail';
import Cities from './pages/Cities';
import HotelDetail from './pages/HotelDetail';
import FlightDetail from './pages/FlightDetail';
import BookingWizard from './pages/BookingWizard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import VendorManagement from './pages/admin/VendorManagement';
import BookingManagement from './pages/admin/BookingManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import RefundManagement from './pages/admin/RefundManagement';
import Support from './pages/admin/Support';
import AuditLogs from './pages/admin/AuditLogs';
import Settings from './pages/admin/Settings';
import ChatWidget from './components/common/ChatWidget';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (user && user.role === 'admin') ? children : <Navigate to="/" />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/cities/:cityName" element={<CityDetail />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/verify-email" 
            element={
              <PublicRoute>
                <VerifyEmail />
              </PublicRoute>
            } 
          />
          <Route 
            path="/verify-otp" 
            element={
              <PublicRoute>
                <VerifyOTP />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hotels" 
            element={
              <ProtectedRoute>
                <Hotels />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/flights" 
            element={
              <ProtectedRoute>
                <Flights />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/packages" 
            element={
              <ProtectedRoute>
                <Packages />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } 
          />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/hotels/:id" element={<ProtectedRoute><HotelDetail /></ProtectedRoute>} />
            <Route path="/flights/:id" element={<ProtectedRoute><FlightDetail /></ProtectedRoute>} />
            <Route path="/booking/:type/:id" element={<ProtectedRoute><BookingWizard /></ProtectedRoute>} />
            <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            <Route path="/payment/failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="vendors" element={<VendorManagement />} />
            <Route path="services" element={<div>Service Management coming soon...</div>} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="refunds" element={<RefundManagement />} />
            <Route path="support" element={<Support />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default App;