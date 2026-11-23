import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import Modal from '../../components/Modal.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { Megaphone, PlusCircle, Edit3, Trash2, Pin, Calendar, User } from 'lucide-react';

const ManageAnnouncements = () => {
  const { showToast } = useNotification();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Academic',
    priority: 'Normal',
    isImportant: false
  });

  const categories = ['Academic', 'Facility', 'Events', 'General'];
  const priorities = ['Normal', 'Important', 'Urgent'];

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.announcements.getAll();
      if (res.success) setAnnouncements(res.announcements || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      category: 'Academic',
      priority: 'Normal',
      isImportant: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      priority: item.priority || 'Normal',
      isImportant: item.isImportant || false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        const res = await api.announcements.update(editingItem.id, formData);
        if (res.success) {
          showToast('Announcement updated successfully!', 'success');
          setIsModalOpen(false);
          fetchAnnouncements();
        }
      } else {
        const res = await api.announcements.create(formData);
        if (res.success) {
          showToast('Announcement published to all students!', 'success');
          setIsModalOpen(false);
          fetchAnnouncements();
        }
      }
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.announcements.delete(deleteTarget.id);
      if (res.success) {
        showToast('Announcement deleted successfully', 'success');
        setAnnouncements(prev => prev.filter(a => a.id !== deleteTarget.id));
      }
    } catch (e) {
      showToast('Failed to delete announcement', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="module-header-actions">
        <div>
          <h1 className="welcome-title">Manage Campus Announcements</h1>
          <p className="welcome-subtitle">
            Publish official university notices, examination alerts, and circulars to students.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <PlusCircle size={18} /> Publish New Announcement
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} height="120px" />
      ) : announcements.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No announcements published"
            message="Create your first official announcement circular."
            actionButton={
              <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
                Publish Now
              </button>
            }
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.map((a) => (
            <div key={a.id} className={`announcement-card ${a.isImportant ? 'important' : ''}`}>
              <div className="announcement-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    {a.isImportant && (
                      <span className="badge priority-urgent">
                        <Pin size={12} /> Pinned / Important
                      </span>
                    )}
                    <span className="badge" style={{ background: 'var(--bg-tertiary)' }}>{a.category}</span>
                    <span className={`badge priority-${a.priority?.toLowerCase() || 'medium'}`}>{a.priority} Priority</span>
                  </div>
                  <h3 className="announcement-title">{a.title}</h3>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(a)}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    style={{ color: 'var(--status-rejected)' }}
                    onClick={() => setDeleteTarget(a)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              <div className="announcement-meta">
                <span>By {a.publishedBy}</span>
                <span>•</span>
                <span>{new Date(a.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <p className="announcement-body">{a.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Announcement' : 'Publish New Announcement'}
        maxWidth="620px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Announcement Headline *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. End Semester Exam Timetable Released"
              required
            />
          </div>

          <div className="report-form-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Circular Content *</label>
            <textarea
              className="form-textarea"
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full announcement body text..."
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isImportant}
                onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
              />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Pin as Important / Urgent Notice across student portals
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Publish Circular'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmationModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Announcement"
          message={`Are you sure you want to delete the announcement "${deleteTarget.title}"?`}
          confirmText="Yes, Delete Announcement"
        />
      )}
    </div>
  );
};

export default ManageAnnouncements;

