import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Bell, 
  MapPin, 
  HelpCircle, 
  BarChart3, 
  Calendar,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Moon, Sun } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <header className="landing-navbar">
        <div className="landing-nav-container">
          <div className="brand-logo">
            <div className="brand-icon">
              <GraduationCap size={22} />
            </div>
            <span>CampusConnect</span>
          </div>

          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#benefits">Benefits</a>
            <Link to="/student/map">Campus Map</Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              className="icon-button" 
              onClick={toggleTheme} 
              title="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#f59e0b" />}
            </button>

            {isAuthenticated ? (
              <Link 
                to={isAdmin ? '/admin/dashboard' : '/student/dashboard'} 
                className="btn btn-primary"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Student Sign In
                </Link>
                <Link to="/admin/login" className="btn btn-primary">
                  Admin Portal <ChevronRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={16} /> Next-Gen Smart Campus Infrastructure Platform
        </div>
        
        <h1 className="hero-title">
          Smart Campus Management <br />
          <span className="hero-title-highlight">& Instant Student Support</span>
        </h1>

        <p className="hero-subtitle">
          Bridging the communication gap between students and college administration. Report facility issues, track real-time resolution timelines, access verified announcements, manage lost items, and explore campus events seamlessly.
        </p>

        <div className="hero-cta-group">
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started as Student <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Demo Student Login
          </Link>
          <Link to="/admin/login" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            <ShieldCheck size={18} color="var(--primary)" /> Administrator Console
          </Link>
        </div>

        {/* Hero Interactive Preview */}
        <div className="hero-preview-wrapper">
          <div style={{
            background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-tertiary) 100%)',
            padding: '30px 20px',
            borderRadius: 'var(--radius-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            textAlign: 'left'
          }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge status-in-progress">In Progress</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CMP-2026-1001</span>
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '6px' }}>Projector flickering in Lab 304</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Audio-Visual Dept assigned. Technician on site.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge priority-urgent">Urgent Notice</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ANN-2026-001</span>
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '6px' }}>Mid-Semester Exam Schedule</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Seating allotment & hall tickets released by Dean Academic Affairs.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge status-resolved">Resolved in 24h</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CMP-2026-1003</span>
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '6px' }}>Water Cooler Leaking in Block B</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Plumber replaced seals. Fully verified and dry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <div className="section-header-center">
          <div className="section-tag">Key Functionalities</div>
          <h2>Designed for Campus Excellence</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Empowering college students, professors, and administrative staff with modern digital tools.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Clock size={24} />
            </div>
            <h3 className="feature-title">Smart Complaint Tracking</h3>
            <p className="feature-desc">
              Submit maintenance, Wi-Fi, lab, and sanitation issues in seconds with unique Complaint IDs, photo uploads, and real-time status timelines.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Bell size={24} />
            </div>
            <h3 className="feature-title">Real-Time Announcements</h3>
            <p className="feature-desc">
              Never miss critical exam dates, campus notices, or timetable changes. Pinned urgent announcements keep everyone instantly informed.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HelpCircle size={24} />
            </div>
            <h3 className="feature-title">Lost & Found Community Hub</h3>
            <p className="feature-desc">
              Safely report misplaced student belongings, browse recently found items across libraries and cafeterias, and arrange verified handovers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Calendar size={24} />
            </div>
            <h3 className="feature-title">College Events & Hackathons</h3>
            <p className="feature-desc">
              Explore upcoming university festivals, coding competitions, expert seminars, and sports tournaments with one-click attendee RSVP.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <MapPin size={24} />
            </div>
            <h3 className="feature-title">Interactive Campus Map</h3>
            <p className="feature-desc">
              Locate campus academic blocks, labs, library pods, parking lots, and health centers with visual facility pins and complaint density overlays.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={24} />
            </div>
            <h3 className="feature-title">Administrative Analytics</h3>
            <p className="feature-desc">
              Comprehensive Recharts visual analytics, category breakdowns, departmental issue trends, and CSV data exports for transparent governance.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-section">
        <div className="section-header-center">
          <div className="section-tag">Workflow</div>
          <h2>How CampusConnect Works</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            A four-step closed-loop process guaranteeing accountability and speedy resolution.
          </p>
        </div>

        <div className="how-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Student Reports Issue</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Student logs in, fills out the issue category, building, and photo, and receives a tracked ticket ID.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Admin Reviews & Assigns</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Facility coordinators receive instant notification, assess priority, and dispatch technicians.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Live Progress Tracking</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Students track each transition (Under Review → In Progress → Resolved) via the interactive timeline.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Resolved & Logged</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Admin records remarks, closes the ticket, and updates campus operational analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '50px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div>
            <div className="section-tag">Measurable Impact</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Built for Rapid Campus Accountability</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              Traditional campus maintenance relies on handwritten logbooks or scattered WhatsApp groups. CampusConnect unifies every report into an immutable audit trail with SLA monitoring.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--status-resolved)" />
                <span style={{ fontWeight: 600 }}>68% reduction in average facility complaint resolution time</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--status-resolved)" />
                <span style={{ fontWeight: 600 }}>100% transparent audit history with timestamps</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--status-resolved)" />
                <span style={{ fontWeight: 600 }}>Secure Role-Based Access Control via Firebase Auth</span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Ready to Experience CampusConnect?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '24px' }}>
              Try out the live demonstration portal with preloaded realistic mock college data and active admin privileges.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                Launch Student Portal <ArrowRight size={16} />
              </Link>
              <Link to="/admin/login" className="btn btn-secondary" style={{ width: '100%' }}>
                Access Administrator Console <ShieldCheck size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div>
            <div className="brand-logo" style={{ marginBottom: '12px' }}>
              <div className="brand-icon">
                <GraduationCap size={22} />
              </div>
              <span>CampusConnect</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '320px', lineHeight: 1.6 }}>
              A centralized smart campus management and student support platform designed for colleges and universities.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modules</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Link to="/student/report">Issue Reporting</Link>
              <Link to="/student/complaints">Complaint Status</Link>
              <Link to="/student/lost-found">Lost & Found</Link>
              <Link to="/student/announcements">Announcements</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administration</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Link to="/admin/login">Admin Console</Link>
              <Link to="/admin/analytics">Analytics & Charts</Link>
              <Link to="/admin/complaints">Manage Complaints</Link>
              <Link to="/student/map">Interactive Map</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Technology</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Built with React.js, Node.js, Express, Firebase Firestore & Authentication, and Google Maps API.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 CampusConnect Platform. Designed for Hackathon Presentation.</div>
          <div>All rights reserved. College Campus Support System.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

