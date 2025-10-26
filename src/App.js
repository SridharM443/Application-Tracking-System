import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ApplicantDashboard from './components/applicant/ApplicantDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import BotDashboard from './components/bot/BotDashboard';
import { ROLES } from './utils/constants';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Applicant Routes */}
              <Route
                path="/applicant/*"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.APPLICANT]}>
                    <ApplicantDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Bot Mimic Routes */}
              <Route
                path="/bot/*"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.BOT_MIMIC]}>
                    <BotDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Default & Error Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route 
                path="/unauthorized" 
                element={
                  <div className="error-page">
                    <h1>403</h1>
                    <h2>Unauthorized Access</h2>
                    <p>You don't have permission to access this page.</p>
                  </div>
                } 
              />
              <Route 
                path="*" 
                element={
                  <div className="error-page">
                    <h1>404</h1>
                    <h2>Page Not Found</h2>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
