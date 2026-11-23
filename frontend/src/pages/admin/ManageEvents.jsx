import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import Modal from '../../components/Modal.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { Calendar, PlusCircle, Edit3, Trash2, MapPin, Clock, Users, ExternalLink } from 'lucide-react';

const ManageEvents = () => {
  const { showToast } = useNotification();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    category: 'Hackathon',
    registrationLink: '',
    imageUrl: ''
  });

  const categories = ['Hackathon', 'Workshop', 'Cultural', 'Sports', 'Seminar', 'General'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.events.getAll({ filter: 'all' });
      if (res.success) setEvents(res.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: '10:00 AM - 04:00 PM',
      venue: 'Main Auditorium',
      category: 'Hackathon',
      registrationLink: 'https://campusconnect.edu/register',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingItem(event);
    setFormData({
      name: event.name,
      description: event.description,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      venue: event.venue,
      category: event.category || 'General',
      registrationLink: event.registrationLink || '',
      imageUrl: event.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        const res = await api.events.update(editingItem.id, formData);
        if (res.success) {
          showToast('Event updated successfully!', 'success');
          setIsModalOpen(false);
          fetchEvents();
        }
      } else {
        const res = await api.events.create(formData);
        if (res.success) {
          showToast('Event created and broadcasted!', 'success');
          setIsModalOpen(false);
          fetchEvents();
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
      const res = await api.events.delete(deleteTarget.id);
      if (res.success) {
        showToast('Event deleted successfully', 'success');
        setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
      }
    } catch (e) {
      showToast('Failed to delete event', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="module-header-actions">
        <div>
          <h1 className="welcome-title">Manage College Events</h1>
          <p className="welcome-subtitle">
            Create and schedule hackathons, technical symposia, sports tournaments, and student workshops.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <PlusCircle size={18} /> Create New Event
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="200px" />
      ) : events.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No events scheduled"
            message="Click below to add a campus event."
            actionButton={
              <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
                Create Event
              </button>
            }
          />
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image-box">
                <img src={event.imageUrl} alt={event.name} className="event-img" />
                <div className="event-date-badge">
                  <div className="event-date-day">{new Date(event.eventDate).getDate()}</div>
                  <div className="event-date-month">{new Date(event.eventDate).toLocaleString('default', { month: 'short' })}</div>
                </div>
              </div>

              <div className="event-card-body">
                <span className="badge" style={{ alignSelf: 'flex-start', background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '8px' }}>
                  {event.category}
                </span>
                <h3 className="event-title">{event.name}</h3>
                <p className="event-desc">{event.description}</p>

                <div className="event-meta-row">
                  <div className="event-meta-item">
                    <Clock size={14} color="var(--primary)" />
                    <span>{event.eventTime}</span>
                  </div>
                  <div className="event-meta-item">
                    <Users size={14} color="var(--primary)" />
                    <span>{event.attendeesCount || 0} registered</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <MapPin size={14} color="var(--primary)" />
                  <span><strong>Venue:</strong> {event.venue}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openEditModal(event)}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    style={{ color: 'var(--status-rejected)' }}
                    onClick={() => setDeleteTarget(event)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit College Event' : 'Create New College Event'}
        maxWidth="640px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Technovation Hackathon 2026"
              required
            />
          </div>

          <div className="report-form-grid">
            <div className="form-group">
              <label className="form-label">Event Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Timing *</label>
              <input
                type="text"
                className="form-input"
                value={formData.eventTime}
                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                placeholder="e.g. 09:00 AM - 05:00 PM"
                required
              />
            </div>
          </div>

          <div className="report-form-grid">
            <div className="form-group">
              <label className="form-label">Venue *</label>
              <input
                type="text"
                className="form-input"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. Main Auditorium / Tech Hub"
                required
              />
            </div>

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
          </div>

          <div className="form-group">
            <label className="form-label">Event Description *</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Keynotes, rules, prizes, and speaker details..."
              required
            />
          </div>

          <div className="report-form-grid">
            <div className="form-group">
              <label className="form-label">Registration / External Link</label>
              <input
                type="url"
                className="form-input"
                value={formData.registrationLink}
                onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cover Image URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Publish Event'}
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
          title="Delete Event"
          message={`Are you sure you want to remove event "${deleteTarget.name}"?`}
          confirmText="Yes, Delete Event"
        />
      )}
    </div>
  );
};

export default ManageEvents;

