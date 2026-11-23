import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  LayoutDashboard, 
  AlertCircle, 
  ClipboardList, 
  HelpCircle, 
  Megaphone, 
  Calendar, 
  MapPin, 
  User, 
  LogOut, 
  Users, 
  BarChart3, 
  GraduationCap, 
  ShieldCheck, 
  X 
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/report', icon: AlertCircle, label: 'Report an Issue' },
    { to: '/student/complaints', icon: ClipboardList, label: 'My Complaints' },
    { to: '/student/lost-found', icon: HelpCircle, label: 'Lost & Found' },
    { to: '/student/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/student/events', icon: Calendar, label: 'College Events' },
    { to: '/student/map', icon: MapPin, label: 'Campus Map' },
    { to: '/student/profile', icon: User, label: 'My Profile' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/complaints', icon: ClipboardList, label: 'Manage Complaints' },
    { to: '/admin/students', icon: Users, label: 'Manage Students' },
    { to: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/admin/events', icon: Calendar, label: 'Manage Events' },
    { to: '/admin/lost-found', icon: HelpCircle, label: 'Lost & Found' },
    { to: '/admin/map', icon: MapPin, label: 'Campus Map' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Reports & Analytics' }
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      <div 
        className={`sidebar-backdrop ${isMobileOpen ? 'open' : ''}`} 
        onClick={closeMobileSidebar} 
      />
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="brand-icon">
              <GraduationCap size={22} />
            </div>
            <span>CampusConnect</span>
            <span className="brand-badge">{isAdmin ? 'Admin' : 'Student'}</span>
          </div>
          <button 
            className="icon-button mobile-menu-btn" 
            onClick={closeMobileSidebar}
            style={{ width: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">
            {isAdmin ? 'Administration Portal' : 'Student Workspace'}
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileSidebar}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} className="nav-icon" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-snippet">
            <div className="user-avatar">
              {isAdmin ? <ShieldCheck size={20} /> : user?.fullName?.charAt(0) || 'S'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.fullName || 'Active User'}</div>
              <div className="user-role-label">
                {isAdmin ? 'Administrator' : user?.studentId || 'Student'}
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary btn-sm" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

