import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { api } from '../../services/api.js';
import { User, Mail, GraduationCap, Building, Phone, Save, Shield } from 'lucide-react';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '+91 98765 43210',
    department: user?.department || 'Computer Science & Engineering',
    yearSemester: user?.yearSemester || '3rd Year / 6th Sem'
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.users.updateProfile(formData);
      if (res.success) {
        updateUser(res.user);
        showToast('Profile information updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="welcome-title">My Student Profile</h1>
        <p className="welcome-subtitle">
          Manage your registered contact information and academic details.
        </p>
      </div>

      <div className="card">
        {/* Profile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '24px'
        }}>
          <div className="user-avatar" style={{ width: '70px', height: '70px', fontSize: '1.8rem' }}>
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user?.fullName}</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
              <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                {user?.studentId || 'ID N/A'}
              </span>
              <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="report-form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">College Email (Read Only)</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="report-form-grid">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Department</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Year / Semester</label>
            <input
              type="text"
              name="yearSemester"
              className="form-input"
              value={formData.yearSemester}
              onChange={handleChange}
              placeholder="e.g. 3rd Year / 6th Sem"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ gap: '8px' }}
            >
              <Save size={16} /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;

