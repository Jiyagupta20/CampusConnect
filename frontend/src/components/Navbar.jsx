import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { Bell, Moon, Sun, Menu, CheckCircle2, Clock, Megaphone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ title, toggleMobileSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markRead, markAllRead } = useNotification();
  const [showNotifs, setShowNotifs] = useState(false);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'complaint':
        return <CheckCircle2 size={18} color="var(--primary)" />;
      case 'announcement':
        return <Megaphone size={18} color="var(--status-submitted)" />;
      case 'event':
        return <Calendar size={18} color="var(--status-progress)" />;
      default:
        return <Clock size={18} color="var(--text-muted)" />;
    }
  };

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button className="icon-button mobile-menu-btn" onClick={toggleMobileSidebar} aria-label="Toggle Navigation">
          <Menu size={20} />
        </button>
        <h1 className="top-navbar-title">{title}</h1>
      </div>

      <div className="top-navbar-actions">
        {/* Dark/Light Mode Switcher */}
        <button 
          className="icon-button" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={19} /> : <Sun size={19} color="#f59e0b" />}
        </button>

        {/* In-app Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-button" 
            onClick={() => setShowNotifs(!showNotifs)} 
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="notif-badge" />}
          </button>

          {showNotifs && (
            <div className="notification-dropdown">
              <div className="notif-header">
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead} 
                    style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notif-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => markRead(notif.id)}
                    >
                      <div style={{ marginTop: '2px' }}>{getNotifIcon(notif.type)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '2px' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="user-avatar" style={{ width: '38px', height: '38px', fontSize: '0.875rem' }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

