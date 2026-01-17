import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Pages
import HomePage from './pages/HomePage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentFiles from './pages/StudentFiles';
import TeacherFiles from './pages/TeacherFiles';
import Lathe3DModel from './pages/Lathe3DModel';


// Context and Constants
export const AuthContext = createContext();
export const API = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'; // Base URL for backend API

function App() {
  // Initialize user from localStorage to persist session
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
      // Redirect to the appropriate dashboard if the role doesn't match
      return <Navigate to={user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard'} replace />;
    }

    return children;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<HomePage />} />

          {/* Student Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-files"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentFiles />
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-files"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherFiles />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route
            path="/lathe-3d"
            element={
              <ProtectedRoute>
                <Lathe3DModel />
              </ProtectedRoute>
            }
          />


          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;