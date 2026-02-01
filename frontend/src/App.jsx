import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';

// Layout Components
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Agent Pages
import AgentDashboard from './pages/agent/AgentDashboard';
import AddPropertyPage from './pages/agent/AddPropertyPage';
import EditPropertyPage from './pages/agent/EditPropertyPage';
import MyPropertiesPage from './pages/agent/MyPropertiesPage';
import InquiriesPage from './pages/agent/InquiriesPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManagePropertiesPage from './pages/admin/ManagePropertiesPage';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <PropertyProvider>
          <div className="App">
            <Routes>
              {/* Auth Routes (No Layout) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Main Routes (With Layout) */}
              <Route path="/" element={<MainLayout />}>
                {/* Public Routes */}
                <Route index element={<HomePage />} />
                <Route path="properties" element={<PropertiesPage />} />
                <Route path="properties/:id" element={<PropertyDetailPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="terms-of-service" element={<TermsOfServicePage />} />
                
                {/* Protected Routes - All Users */}
                <Route path="profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="wishlist" element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                } />
                
                {/* Agent Routes */}
                <Route path="dashboard" element={
                  <ProtectedRoute roles={['agent']}>
                    <AgentDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="properties/add" element={
                  <ProtectedRoute roles={['agent', 'admin']}>
                    <AddPropertyPage />
                  </ProtectedRoute>
                } />
                
                <Route path="properties/:id/edit" element={
                  <ProtectedRoute roles={['agent', 'admin']}>
                    <EditPropertyPage />
                  </ProtectedRoute>
                } />
                
                <Route path="my-properties" element={
                  <ProtectedRoute roles={['agent', 'admin']}>
                    <MyPropertiesPage />
                  </ProtectedRoute>
                } />
                
                <Route path="inquiries" element={
                  <ProtectedRoute roles={['agent', 'admin']}>
                    <InquiriesPage />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="admin/dashboard" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="admin/users" element={
                  <ProtectedRoute roles={['admin']}>
                    <ManageUsersPage />
                  </ProtectedRoute>
                } />
                
                <Route path="admin/properties" element={
                  <ProtectedRoute roles={['admin']}>
                    <ManagePropertiesPage />
                  </ProtectedRoute>
                } />
                
                {/* Error Pages */}
                <Route path="unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </PropertyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;