import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
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

    const res = await login(email, password, 'admin');
    setLoading(false);

    if (res.success) {
      showToast('Authenticated as College Administrator', 'success');
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res.message || 'Access denied. Account does not have admin permissions.');
    }
  };

  const handleAdminDemo = async () => {
    setLoading(true);
    const res = await demoLogin('admin');
    setLoading(false);
    if (res.success) {
      showToast('Logged in with Demo Admin Account!', 'success');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <Link to="/" className="auth-brand" style={{ color: 'var(--navy-blue)' }}>
          <ShieldCheck size={28} color="var(--primary)" />
          <span>CampusConnect</span>
        </Link>
        <h2 className="auth-title">Administrative Portal</h2>
        <p className="auth-subtitle">Authorized campus administration and facility staff access only</p>
      </div>

      {/* Demo Access Button for Hackathon Judges */}
      <div className="demo-accounts-box" style={{ borderColor: 'var(--primary)', background: 'var(--primary-light)' }}>
        <div className="demo-accounts-title">
          <Sparkles size={14} /> Hackathon Judge Quick Access
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Evaluate the complete administrative dashboard, manage complaints, and view live analytics charts with one click.
        </p>
        <button 
          type="button" 
          className="demo-pill" 
          onClick={handleAdminDemo}
          style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none' }}
          disabled={loading}
        >
          🛡️ 1-Click Administrator Access (Dr. Arvind Sharma)
        </button>
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
          <label className="form-label">Admin Email Address</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. admin@campusconnect.edu"
            required
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">Password</label>
            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter administrative master password"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'Sign In as Administrator'} <ArrowRight size={16} />
        </button>
      </form>

      <div className="auth-footer">
        Are you a student?{' '}
        <Link to="/login" className="auth-link">
          Go to Student Login
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;

