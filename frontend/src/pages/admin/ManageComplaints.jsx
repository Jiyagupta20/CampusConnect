import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import PriorityBadge from '../../components/PriorityBadge.jsx';
import ComplaintDetailModal from '../../components/ComplaintDetailModal.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  MapPin, 
  User, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

const ManageComplaints = () => {
  const { showToast } = useNotification();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.complaints.getAll(params);
      if (res.success) setComplaints(res.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter, priorityFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const handleExportCSV = async () => {
    try {
      showToast('Exporting complaints to CSV...', 'info');
      await api.complaints.exportCSV();
      showToast('CSV downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to export CSV', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      const res = await api.complaints.delete(deleteCandidate.id);
      if (res.success) {
        showToast(`Complaint ${deleteCandidate.id} deleted.`, 'success');
        setComplaints(prev => prev.filter(c => c.id !== deleteCandidate.id));
      }
    } catch (e) {
      showToast('Failed to delete complaint', 'error');
    } finally {
      setDeleteCandidate(null);
    }
  };

  const categories = [
    'All',
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

  const statuses = ['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Urgent'];

  return (
    <div>
      <div className="module-header-actions">
        <div>
          <h1 className="welcome-title">Manage Student Complaints</h1>
          <p className="welcome-subtitle">
            Review, update status, assign departmental technicians, and archive campus issue tickets.
          </p>
        </div>
        <button onClick={handleExportCSV} className="btn btn-primary">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Advanced Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <form onSubmit={handleSearch} className="complaints-filter-bar" style={{ margin: 0 }}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search by ID, student roll, student name, keyword, room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              style={{ width: '150px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
            </select>

            <select
              className="form-select"
              style={{ width: '150px' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {priorities.map(p => <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>)}
            </select>

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

      {/* Table */}
      {loading ? (
        <LoadingSkeleton count={6} height="70px" />
      ) : complaints.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No complaints matching criteria"
            message="Try clearing or adjusting your search filters."
          />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Title & Location</th>
                <th>Student</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {c.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{c.title}</div>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {c.location} {c.roomNumber ? `(${c.roomNumber})` : ''}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.studentRoll}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{c.category}</td>
                  <td><PriorityBadge priority={c.priority} /></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="btn btn-secondary btn-sm"
                        title="View / Change Status"
                      >
                        <Eye size={14} /> Action
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(c)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--status-rejected)' }}
                        title="Delete record"
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

      {/* Complaint Detail & Status Changer Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          complaint={selectedComplaint}
          onUpdateSuccess={(updated) => {
            setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <ConfirmationModal
          isOpen={!!deleteCandidate}
          onClose={() => setDeleteCandidate(null)}
          onConfirm={handleDelete}
          title="Delete Complaint Ticket"
          message={`Are you sure you want to permanently delete complaint ${deleteCandidate.id} ("${deleteCandidate.title}")? This action cannot be undone.`}
          confirmText="Yes, Delete Ticket"
        />
      )}
    </div>
  );
};

export default ManageComplaints;

