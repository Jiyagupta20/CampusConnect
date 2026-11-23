import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { HelpCircle, Trash2, CheckCircle, Search, MapPin, Phone } from 'lucide-react';

const ManageLostFound = () => {
  const { showToast } = useNotification();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.lostFound.getAll();
      if (res.success) setItems(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'claimed' ? 'open' : 'claimed';
    try {
      const res = await api.lostFound.updateStatus(item.id, nextStatus);
      if (res.success) {
        showToast(`Item status set to ${nextStatus}`, 'success');
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: nextStatus } : i));
      }
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.lostFound.delete(deleteTarget.id);
      if (res.success) {
        showToast('Lost/Found record removed.', 'success');
        setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
      }
    } catch (e) {
      showToast('Failed to delete item', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    return (
      (i.itemName && i.itemName.toLowerCase().includes(q)) ||
      (i.location && i.location.toLowerCase().includes(q)) ||
      (i.category && i.category.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="module-header-actions">
        <div>
          <h1 className="welcome-title">Moderate Lost & Found Hub</h1>
          <p className="welcome-subtitle">
            Oversee community items, verify claims, and moderate student posts.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search items by name, category, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} height="70px" />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState title="No items found" message="No records match your search." />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Location</th>
                <th>Reported By</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.itemName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.description}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${item.type === 'lost' ? 'status-rejected' : 'status-resolved'}`} style={{ textTransform: 'uppercase' }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{item.category}</td>
                  <td style={{ fontSize: '0.85rem' }}>📍 {item.location}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{item.reportedByName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.contactInfo}</div>
                  </td>
                  <td>
                    <span className={`badge ${item.status === 'claimed' ? 'status-resolved' : 'status-submitted'}`}>
                      {item.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleToggleStatus(item)}
                      >
                        {item.status === 'claimed' ? 'Reopen' : 'Mark Claimed'}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--status-rejected)' }}
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmationModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Lost/Found Post"
          message={`Are you sure you want to remove the post for "${deleteTarget.itemName}"?`}
          confirmText="Yes, Delete Post"
        />
      )}
    </div>
  );
};

export default ManageLostFound;

