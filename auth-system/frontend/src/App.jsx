import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Security from './pages/Security';
import Projects from './pages/projects/Projects';
import ProjectDetail from './pages/projects/ProjectDetail';
import ProjectSettings from './pages/projects/ProjectSettings';
import ProjectUsers from './pages/projects/ProjectUsers';
import CreateProject from './pages/projects/CreateProject';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-base-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="verify-email" element={<VerifyEmail />} />
            </Route>

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Profile Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/security"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Security />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Projects Routes */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Projects />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/create"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreateProject />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/:projectId/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectSettings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/:projectId/users"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectUsers />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Fallback Routes */}
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
            <Route path="/verify-email" element={<Navigate to="/auth/verify-email" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--fallback-b1, oklch(var(--b1)))',
                color: 'var(--fallback-bc, oklch(var(--bc)))',
                border: '1px solid var(--fallback-b3, oklch(var(--b3)))',
              },
              success: {
                iconTheme: {
                  primary: 'var(--fallback-su, oklch(var(--su)))',
                  secondary: 'var(--fallback-suc, oklch(var(--suc)))',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--fallback-er, oklch(var(--er)))',
                  secondary: 'var(--fallback-erc, oklch(var(--erc)))',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
