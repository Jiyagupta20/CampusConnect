import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { GraduationCap, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, demoLogin } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password, 'student');
    setLoading(false);

    if (res.success) {
      showToast('Welcome back to CampusConnect!', 'success');
      navigate('/student/dashboard');
    } else {
      setErrorMsg(res.message || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    const res = await demoLogin('student');
    setLoading(false);
    if (res.success) {
      showToast('Logged in with Demo Student Account!', 'success');
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <Link to="/" className="auth-brand">
          <GraduationCap size={28} />
          <span>CampusConnect</span>
        </Link>
        <h2 className="auth-title">Student Portal Login</h2>
        <p className="auth-subtitle">Sign in to report campus issues and track your complaints</p>
      </div>

      {/* Quick Demo Switcher for Judges */}
      <div className="demo-accounts-box">
        <div className="demo-accounts-title">
          <Sparkles size={14} /> Quick Demo Access (For Judges)
        </div>
        <div className="demo-btn-group">
          <button 
            type="button" 
            className="demo-pill" 
            onClick={handleQuickDemo}
            disabled={loading}
          >
            👨‍🎓 1-Click Student Demo
          </button>
          <Link 
            to="/admin/login" 
            className="demo-pill"
            style={{ textDecoration: 'none' }}
          >
            🛡️ Admin Login
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--status-rejected-bg)',
          color: 'var(--status-rejected)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">College Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. aarav.patel@campusconnect.edu"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">Password</label>
            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'Sign In as Student'} <ArrowRight size={16} />
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account yet?{' '}
        <Link to="/register" className="auth-link">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default StudentLogin;

