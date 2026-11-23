import React, { useState } from 'react';
import Modal from './Modal.jsx';
import StatusBadge from './StatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import Timeline from './Timeline.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { api } from '../services/api.js';
import { MapPin, User, Calendar, Image as ImageIcon, CheckCircle, MessageSquare } from 'lucide-react';

const ComplaintDetailModal = ({ isOpen, onClose, complaint, onUpdateSuccess }) => {
  const { isAdmin } = useAuth();
  const { showToast } = useNotification();
  const [newStatus, setNewStatus] = useState(complaint?.status || 'Submitted');
  const [adminRemarks, setAdminRemarks] = useState(complaint?.adminRemarks || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!complaint) return null;

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await api.complaints.updateStatus(complaint.id, newStatus, adminRemarks);
      if (res.success) {
        showToast(`Complaint status updated to ${newStatus}`, 'success');
        if (onUpdateSuccess) onUpdateSuccess(res.complaint);
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Complaint Details – ${complaint.id}`}
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {isAdmin && (
            <button 
              className="btn btn-primary" 
              onClick={handleStatusUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Status Update'}
            </button>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Title and Badges */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {complaint.id}
            </span>
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
            <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              {complaint.category}
            </span>
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{complaint.title}</h3>
        </div>

        {/* Metadata Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          padding: '16px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <MapPin size={16} color="var(--primary)" />
            <span><strong>Location:</strong> {complaint.location} ({complaint.roomNumber || 'Room N/A'})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <User size={16} color="var(--primary)" />
            <span><strong>Student:</strong> {complaint.studentName} ({complaint.studentRoll || 'ID N/A'})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Calendar size={16} color="var(--primary)" />
            <span><strong>Logged:</strong> {new Date(complaint.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Issue Description</h4>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {complaint.description}
          </p>
        </div>

        {/* Attached Photo Preview */}
        {complaint.imageUrl && (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ImageIcon size={16} /> Attached Image Evidence
            </h4>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '240px' }}>
              <img 
                src={complaint.imageUrl} 
                alt="Complaint evidence" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </div>
        )}

        {/* Admin Remarks if available */}
        {complaint.adminRemarks && (
          <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', borderLeft: '4px solid var(--primary)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} /> Official Administration Remarks
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              {complaint.adminRemarks}
            </p>
          </div>
        )}

        {/* Admin Action Box */}
        {isAdmin && (
          <div style={{ padding: '18px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Administrative Action</h4>
            <div className="report-form-grid" style={{ marginBottom: '12px' }}>
              <div className="form-group">
                <label className="form-label">Update Status</label>
                <select 
                  className="form-select" 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Internal / Public Remarks</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={adminRemarks} 
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder="e.g. Electrician assigned. Parts ordered." 
                />
              </div>
            </div>
          </div>
        )}

        {/* Resolution Timeline */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>Resolution Timeline</h4>
          <Timeline timeline={complaint.timeline} currentStatus={complaint.status} />
        </div>
      </div>
    </Modal>
  );
};

export default ComplaintDetailModal;

