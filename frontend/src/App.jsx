import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

// Layouts
import StudentLayout from './layouts/StudentLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import StudentLogin from './pages/auth/StudentLogin.jsx';
import StudentRegister from './pages/auth/StudentRegister.jsx';
import AdminLogin from './pages/auth/AdminLogin.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import ReportIssue from './pages/student/ReportIssue.jsx';
import MyComplaints from './pages/student/MyComplaints.jsx';
import StudentLostFound from './pages/student/StudentLostFound.jsx';
import StudentAnnouncements from './pages/student/StudentAnnouncements.jsx';
import StudentEvents from './pages/student/StudentEvents.jsx';
import StudentProfile from './pages/student/StudentProfile.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageComplaints from './pages/admin/ManageComplaints.jsx';
import ManageStudents from './pages/admin/ManageStudents.jsx';
import ManageAnnouncements from './pages/admin/ManageAnnouncements.jsx';
import ManageEvents from './pages/admin/ManageEvents.jsx';
import ManageLostFound from './pages/admin/ManageLostFound.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';

// Shared Pages
import CampusMap from './pages/CampusMap.jsx';

// Styles
import './styles/index.css';
import './styles/components.css';
import './styles/sidebar.css';
import './styles/dashboard.css';
import './styles/complaints.css';
import './styles/auth.css';
import './styles/landing.css';
import './styles/map.css';
import './styles/modules.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Authentication Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<StudentLogin />} />
                <Route path="/register" element={<StudentRegister />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Student Portal Routes */}
              <Route path="/student" element={<StudentLayout title="Student Workspace" />}>
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="report" element={<ReportIssue />} />
                <Route path="complaints" element={<MyComplaints />} />
                <Route path="lost-found" element={<StudentLostFound />} />
                <Route path="announcements" element={<StudentAnnouncements />} />
                <Route path="events" element={<StudentEvents />} />
                <Route path="map" element={<CampusMap />} />
                <Route path="profile" element={<StudentProfile />} />
              </Route>

              {/* Admin Portal Routes */}
              <Route path="/admin" element={<AdminLayout title="Administration Command Center" />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="complaints" element={<ManageComplaints />} />
                <Route path="students" element={<ManageStudents />} />
                <Route path="announcements" element={<ManageAnnouncements />} />
                <Route path="events" element={<ManageEvents />} />
                <Route path="lost-found" element={<ManageLostFound />} />
                <Route path="map" element={<CampusMap />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>

              {/* 404 Catch All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

