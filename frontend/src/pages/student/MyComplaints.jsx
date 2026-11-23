import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import PriorityBadge from '../../components/PriorityBadge.jsx';
import ComplaintDetailModal from '../../components/ComplaintDetailModal.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Eye, 
  MapPin, 
  Clock, 
  FileText 
} from 'lucide-react';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.complaints.getAll(params);
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
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

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-title">My Complaints & Issues</h1>
          <p className="welcome-subtitle">
            Track real-time progress, status updates, and administrative remarks for your reported tickets.
          </p>
        </div>
        <Link to="/student/report" className="btn btn-primary">
          <PlusCircle size={18} /> Report New Issue
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} className="complaints-filter-bar" style={{ margin: 0 }}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search by Complaint ID (e.g. CMP-2026-1001), keyword, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st === 'All' ? 'All Statuses' : st}</option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: '200px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>

            <button type="submit" className="btn btn-secondary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Complaints Table */}
      {loading ? (
        <LoadingSkeleton count={5} height="75px" />
      ) : complaints.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No matching complaints found"
            message="No complaint records match your active search or filter criteria."
            actionButton={
              <Link to="/student/report" className="btn btn-primary btn-sm">
                Submit a New Complaint
              </Link>
            }
          />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {c.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.925rem', marginBottom: '2px' }}>
                      {c.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.description}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{c.category}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="var(--primary)" /> {c.location}
                    </div>
                    {c.roomNumber && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {c.roomNumber}
                      </div>
                    )}
                  </td>
                  <td>
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedComplaint(c)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Complaint Detail Tracking Modal */}
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
    </div>
  );
};

export default MyComplaints;

