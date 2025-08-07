import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ProjectsProvider } from './contexts/ProjectsContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Project pages
import Projects from './pages/projects/Projects';
import CreateProject from './pages/projects/CreateProject';
import ProjectDashboard from './pages/projects/ProjectDashboard';
import ProjectSettings from './pages/projects/ProjectSettings';
import ProjectUsers from './pages/projects/ProjectUsers';
import ProjectAnalytics from './pages/projects/ProjectAnalytics';
import ProjectGuide from './pages/projects/ProjectGuide';

// Documentation pages
import QuickStart from './pages/docs/QuickStart';
import ApiReference from './pages/docs/ApiReference';
import SdkDocumentation from './pages/docs/SdkDocumentation';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectsProvider>
          <div className="min-h-screen bg-base-200">
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'text-sm',
                style: {
                  background: 'var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))',
                  color: 'var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)))',
                  border: '1px solid var(--fallback-b3,oklch(var(--b3)/var(--tw-border-opacity)))',
                },
              }}
            />

            <Routes>
              {/* Public Routes - redirect to dashboard if authenticated */}
              <Route path="/" element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              } />
              
              {/* Auth Routes - redirect to dashboard if authenticated */}
              <Route path="/auth/*" element={
                <PublicRoute>
                  <AuthLayout>
                    <Routes>
                      <Route path="login" element={<Login />} />
                      <Route path="signup" element={<Signup />} />
                      <Route path="forgot-password" element={<ForgotPassword />} />
                      <Route path="reset-password" element={<ResetPassword />} />
                      <Route path="verify-email" element={<VerifyEmail />} />
                      <Route path="*" element={<Navigate to="/auth/login" replace />} />
                    </Routes>
                  </AuthLayout>
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Project Routes */}
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Layout>
                    <Projects />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/projects/create" element={
                <ProtectedRoute>
                  <Layout>
                    <CreateProject />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Individual Project Routes */}
              <Route path="/project/:projectId/*" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route index element={<ProjectDashboard />} />
                      <Route path="users" element={<ProjectUsers />} />
                      <Route path="analytics" element={<ProjectAnalytics />} />
                      <Route path="settings" element={<ProjectSettings />} />
                      <Route path="guide" element={<ProjectGuide />} />
                      <Route path="*" element={<Navigate to="../" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Documentation Routes */}
              <Route path="/docs" element={<QuickStart />} />
              <Route path="/docs/quickstart" element={<QuickStart />} />
              <Route path="/docs/installation" element={<QuickStart />} />
              <Route path="/docs/authentication" element={<QuickStart />} />
              <Route path="/docs/api" element={<ApiReference />} />
              <Route path="/docs/api/auth" element={<ApiReference />} />
              <Route path="/docs/api/users" element={<ApiReference />} />
              <Route path="/docs/api/projects" element={<ApiReference />} />
              <Route path="/docs/sdk" element={<SdkDocumentation />} />
              <Route path="/docs/react" element={<SdkDocumentation />} />
              <Route path="/docs/nodejs" element={<SdkDocumentation />} />
              <Route path="/docs/examples" element={<SdkDocumentation />} />
              <Route path="/docs/best-practices" element={<SdkDocumentation />} />
              <Route path="/docs/security" element={<SdkDocumentation />} />
              <Route path="/docs/deployment" element={<SdkDocumentation />} />
              <Route path="/docs/features/*" element={<SdkDocumentation />} />
              <Route path="/docs/guides" element={<SdkDocumentation />} />
              <Route path="/docs/troubleshooting" element={<SdkDocumentation />} />
              <Route path="/docs/mobile" element={<SdkDocumentation />} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ProjectsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
