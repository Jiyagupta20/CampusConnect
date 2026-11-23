import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { GraduationCap, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    yearSemester: '3rd Year / 5th Sem',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical & Electronics',
    'Biotechnology',
    'Business Administration (MBA)'
  ];

  const yearSemesters = [
    '1st Year / 1st Sem',
    '1st Year / 2nd Sem',
    '2nd Year / 3rd Sem',
    '2nd Year / 4th Sem',
    '3rd Year / 5th Sem',
    '3rd Year / 6th Sem',
    '4th Year / 7th Sem',
    '4th Year / 8th Sem'
  ];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await register({
      fullName: formData.fullName,
      email: formData.email,
      studentId: formData.studentId,
      department: formData.department,
      yearSemester: formData.yearSemester,
      password: formData.password
    });
    setLoading(false);

    if (res.success) {
      showToast('Registration successful! Welcome to CampusConnect.', 'success');
      navigate('/student/dashboard');
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: '620px' }}>
      <div className="auth-header">
        <Link to="/" className="auth-brand">
          <GraduationCap size={28} />
          <span>CampusConnect</span>
        </Link>
        <h2 className="auth-title">Student Registration</h2>
        <p className="auth-subtitle">Create your college account to report issues and access campus services</p>
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
        <div className="report-form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Aarav Patel"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">College Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. aarav@campusconnect.edu"
              required
            />
          </div>
        </div>

        <div className="report-form-grid">
          <div className="form-group">
            <label className="form-label">Student ID / Roll Number</label>
            <input
              type="text"
              name="studentId"
              className="form-input"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g. CSE-2023-042"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              name="department"
              className="form-select"
              value={formData.department}
              onChange={handleChange}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Year / Semester</label>
          <select
            name="yearSemester"
            className="form-select"
            value={formData.yearSemester}
            onChange={handleChange}
          >
            {yearSemesters.map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        <div className="report-form-grid">
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
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
          {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={16} />
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?{' '}
        <Link to="/login" className="auth-link">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default StudentRegister;

