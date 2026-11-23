import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/Modal.jsx';
import { Megaphone, Search, AlertCircle, Calendar, User, Eye, Pin } from 'lucide-react';

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [activeModalNotice, setActiveModalNotice] = useState(null);

  const categories = ['All', 'Academic', 'Facility', 'Events', 'General'];

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.announcements.getAll(params);
      if (res.success) setAnnouncements(res.announcements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnnouncements();
  };

  return (
    <div>
      <div className="module-header-actions">
        <div>
          <h1 className="welcome-title">Campus Announcements</h1>
          <p className="welcome-subtitle">
            Official university notices, exam updates, facility advisories, and campus circulars.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <form onSubmit={handleSearch} className="complaints-filter-bar" style={{ margin: 0 }}>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search announcements by headline or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              style={{ width: '180px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Announcements List */}
      {loading ? (
        <LoadingSkeleton count={4} height="120px" />
      ) : announcements.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No announcements found"
            message="There are currently no circulars matching your active filter."
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.map((a) => (
            <div 
              key={a.id} 
              className={`announcement-card ${a.isImportant ? 'important' : ''}`}
            >
              <div className="announcement-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    {a.isImportant && (
                      <span className="badge priority-urgent">
                        <Pin size={12} /> Pinned / Important
                      </span>
                    )}
                    <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {a.category}
                    </span>
                    <span className={`badge priority-${a.priority?.toLowerCase() || 'medium'}`}>
                      {a.priority} Priority
                    </span>
                  </div>
                  <h3 className="announcement-title">{a.title}</h3>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveModalNotice(a)}
                  style={{ gap: '6px', whiteSpace: 'nowrap' }}
                >
                  <Eye size={14} /> Full Circular
                </button>
              </div>

              <div className="announcement-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={13} /> {a.publishedBy || 'Administration'}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {new Date(a.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <p className="announcement-body">
                {a.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Full Circular View Modal */}
      {activeModalNotice && (
        <Modal
          isOpen={!!activeModalNotice}
          onClose={() => setActiveModalNotice(null)}
          title={activeModalNotice.title}
          maxWidth="680px"
          footer={
            <button className="btn btn-primary" onClick={() => setActiveModalNotice(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'var(--bg-tertiary)' }}>{activeModalNotice.category}</span>
              <span className={`badge priority-${activeModalNotice.priority?.toLowerCase() || 'medium'}`}>{activeModalNotice.priority}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Published on {new Date(activeModalNotice.createdAt).toLocaleString()}
              </span>
            </div>

            <div style={{
              fontSize: '0.95rem',
              lineHeight: 1.8,
              color: 'var(--text-primary)',
              background: 'var(--bg-secondary)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              whiteSpace: 'pre-line'
            }}>
              {activeModalNotice.content}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Authority:</strong> {activeModalNotice.publishedBy}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentAnnouncements;

