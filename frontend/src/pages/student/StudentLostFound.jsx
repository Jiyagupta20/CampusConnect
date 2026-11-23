import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import Modal from '../../components/Modal.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { 
  HelpCircle, 
  PlusCircle, 
  Search, 
  MapPin, 
  Phone, 
  Tag, 
  CheckCircle, 
  Upload,
  Calendar
} from 'lucide-react';

const StudentLostFound = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'lost', 'found'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'lost',
    itemName: '',
    category: 'Electronics',
    description: '',
    location: '',
    contactInfo: '',
    imageUrl: ''
  });

  const categories = ['All', 'Electronics', 'Personal Items', 'Stationery', 'Documents & IDs', 'Clothing', 'Keys', 'Other'];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'all') params.type = activeTab;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.lostFound.getAll(params);
      if (res.success) setItems(res.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.lostFound.create(formData);
      if (res.success) {
        showToast(`Reported ${formData.type === 'lost' ? 'lost' : 'found'} item successfully!`, 'success');
        setIsModalOpen(false);
        setFormData({
          type: 'lost',
          itemName: '',
          category: 'Electronics',
          description: '',
          location: '',
          contactInfo: '',
          imageUrl: ''
        });
        fetchItems();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkClaimed = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'claimed' ? 'open' : 'claimed';
    try {
      const res = await api.lostFound.updateStatus(id, nextStatus);
      if (res.success) {
        showToast(`Item marked as ${nextStatus}!`, 'success');
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: nextStatus } : i));
      }
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div>
      <div className="module-header-actions">
        <div>
          <h1 className="welcome-title">Campus Lost & Found Hub</h1>
          <p className="welcome-subtitle">
            Report lost possessions or help return found belongings to fellow students.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={18} /> Report Lost / Found Item
        </button>
      </div>

      {/* Filter and Tab Strip */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'lost', 'found'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {tab === 'all' ? 'All Posts' : `${tab} Items`}
              </button>
            ))}
          </div>

          {/* Search & Category */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '500px' }}>
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Search item name, brand, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ width: '160px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </form>
        </div>
      </div>

      {/* Lost & Found Cards Grid */}
      {loading ? (
        <LoadingSkeleton count={4} height="200px" />
      ) : items.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No lost or found items posted"
            message="No records match your active filter."
            actionButton={
              <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
                Report an Item
              </button>
            }
          />
        </div>
      ) : (
        <div className="lost-found-grid">
          {items.map((item) => (
            <div key={item.id} className="lf-card">
              <div className="lf-image-box">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.itemName} className="lf-img" />
                ) : (
                  <HelpCircle size={48} color="var(--text-muted)" />
                )}
                <span className={`lf-type-pill ${item.type === 'lost' ? 'lf-type-lost' : 'lf-type-found'}`}>
                  {item.type}
                </span>
                {item.status === 'claimed' && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'var(--status-resolved)',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    CLAIMED / RETURNED
                  </span>
                )}
              </div>

              <div className="lf-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <h3 className="lf-title">{item.itemName}</h3>
                <p className="lf-desc">{item.description}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span><strong>Location:</strong> {item.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="var(--primary)" />
                    <span><strong>Contact:</strong> {item.contactInfo}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  {(item.reportedBy === user?.id || user?.role === 'admin') && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleMarkClaimed(item.id, item.status)}
                    >
                      {item.status === 'claimed' ? 'Re-open' : 'Mark Claimed'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report Lost or Found Item"
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={formData.type === 'lost'}
                  onChange={handleFormChange}
                />
                <span style={{ fontWeight: 600 }}>I Lost an Item</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={formData.type === 'found'}
                  onChange={handleFormChange}
                />
                <span style={{ fontWeight: 600 }}>I Found an Item</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Item Name</label>
            <input
              type="text"
              name="itemName"
              className="form-input"
              value={formData.itemName}
              onChange={handleFormChange}
              placeholder="e.g. Blue Dell Laptop Charger or Fastrack Watch"
              required
            />
          </div>

          <div className="report-form-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleFormChange}
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location Where Lost/Found</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="e.g. Central Library 2nd Floor"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Identifying Details</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Color, brand, stickers, serial hints, or where it was deposited."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Information</label>
            <input
              type="text"
              name="contactInfo"
              className="form-input"
              value={formData.contactInfo}
              onChange={handleFormChange}
              placeholder="e.g. Phone number, email, or 'Handed over to Security Desk'"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleImageFile}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Post Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentLostFound;

