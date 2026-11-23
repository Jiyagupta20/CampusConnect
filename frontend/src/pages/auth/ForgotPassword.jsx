import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { GraduationCap, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.forgotPassword(email);
      setSubmitted(true);
    } catch (e) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <Link to="/" className="auth-brand">
          <GraduationCap size={28} />
          <span>CampusConnect</span>
        </Link>
        <h2 className="auth-title">Reset Account Password</h2>
        <p className="auth-subtitle">Enter your college email address to receive password reset instructions</p>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircle2 size={48} color="var(--status-resolved)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Reset Link Dispatched</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            If an account is associated with <strong>{email}</strong>, a secure reset token has been sent to your university mailbox.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@campusconnect.edu"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;

