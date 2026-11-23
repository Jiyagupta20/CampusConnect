import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const StudentLayout = ({ title = 'Student Dashboard' }) => {
  const { isAuthenticated, loading, isStudent } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Loading CampusConnect...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        closeMobileSidebar={() => setIsMobileOpen(false)} 
      />
      <div className="main-wrapper">
        <Navbar 
          title={title} 
          toggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)} 
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;

