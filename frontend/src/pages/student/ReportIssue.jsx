import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import { 
  AlertCircle, 
  MapPin, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Image as ImageIcon 
} from 'lucide-react';

const ReportIssue = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Classroom Maintenance',
    description: '',
    location: 'Academic Block A',
    roomNumber: '',
    priority: 'Medium',
    imageUrl: ''
  });

  const categories = [
    'Classroom Maintenance',
    'Electricity Problems',
    'Water Supply',
    'Cleanliness',
    'Washroom Issues',
    'Internet / Wi-Fi',
    'Laboratory Issues',
    'Furniture Damage',
    'Other'
  ];

  const locations = [
    'Academic Block A',
    'Academic Block B',
    'Academic Block C',
    'Central Library',
    'Engineering Labs Block',
    'Auditorium Complex',
    'Main Cafeteria & Food Court',
    'Sports Complex & Gym',
    'Boys Hostel Block',
    'Girls Hostel Block',
    'Health Center & Clinic',
    'Parking Area'
  ];

  // Quick Preset samples for rapid hackathon testing
  const samplePresets = [
    {
      title: 'Lab 202 Air Conditioner not cooling',
      category: 'Classroom Maintenance',
      location: 'Engineering Labs Block',
      roomNumber: 'Lab 202',
      priority: 'High',
      description: 'The split AC unit in computer lab 202 makes a loud rattling sound and blows ambient air instead of cooling.',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Water tap leaking in 1st Floor Washroom',
      category: 'Washroom Issues',
      location: 'Academic Block B',
      roomNumber: '1st Floor Washroom',
      priority: 'Urgent',
      description: 'Continuous heavy tap leakage leading to overflowing basin and slippery floor in Academic Block B.',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Wi-Fi connectivity dropping in Library 3rd Floor',
      category: 'Internet / Wi-Fi',
      location: 'Central Library',
      roomNumber: '3rd Floor Reference Section',
      priority: 'Medium',
      description: 'Access Point CC_STUDENT_3F disconnects every 5 minutes during research browsing.',
      imageUrl: ''
    }
  ];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyPreset = (preset) => {
    setFormData(preset);
    showToast('Loaded sample complaint details!', 'info');
  };

  // Handle image upload / conversion to base64
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image size exceeds 8MB limit', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
        showToast('Photo evidence attached', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('Please fill out the issue title and description.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.complaints.create(formData);
      if (res.success) {
        showToast(`Complaint ${res.complaint.id} submitted successfully!`, 'success');
        navigate('/student/complaints');
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit complaint', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>Report Campus Issue</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Submit facility, equipment, or campus maintenance issues directly to college authorities. An official tracking ticket will be generated instantly.
        </p>
      </div>

      {/* Quick Demo Preset Chips for Judges */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px dashed var(--primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
          <Sparkles size={16} /> Quick Presets for Demo (Click to autofill)
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {samplePresets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => applyPreset(p)}
              style={{ fontSize: '0.8rem' }}
            >
              Preset #{idx + 1}: {p.title}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Issue Title */}
          <div className="form-group">
            <label className="form-label">Complaint Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Broken bench in Classroom 201 or Water leak in Block B"
              required
            />
          </div>

          {/* Category & Priority */}
          <div className="report-form-grid">
            <div className="form-group">
              <label className="form-label">Issue Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level *</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="Low">Low – Non-urgent cosmetic issue</option>
                <option value="Medium">Medium – Standard maintenance required</option>
                <option value="High">High – Affecting lectures / lab sessions</option>
                <option value="Urgent">Urgent – Safety hazard or total disruption</option>
              </select>
            </div>
          </div>

          {/* Location & Room Number */}
          <div className="report-form-grid">
            <div className="form-group">
              <label className="form-label">Campus Location / Building *</label>
              <select
                name="location"
                className="form-select"
                value={formData.location}
                onChange={handleChange}
                required
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Room Number / Specific Spot</label>
              <input
                type="text"
                name="roomNumber"
                className="form-input"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g. Lab 304, LH-02, 2nd Floor Corridor"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Explain the problem clearly: What is malfunctioning? When did it start? How does it affect students?"
              required
            />
          </div>

          {/* Photo Evidence Upload */}
          <div className="form-group">
            <label className="form-label">Upload Photo Evidence (Optional)</label>
            <div className="image-dropzone" onClick={() => document.getElementById('complaint-photo-input').click()}>
              <input
                id="complaint-photo-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageFileChange}
              />
              <Upload size={32} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>
                Click to browse or drop an image file
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                PNG, JPG, or WEBP up to 8MB
              </div>
            </div>

            {formData.imageUrl && (
              <div style={{ marginTop: '14px', position: 'relative', display: 'inline-block' }}>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  style={{ maxHeight: '180px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/student/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              {submitting ? 'Submitting Issue...' : 'Submit Complaint'} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;

