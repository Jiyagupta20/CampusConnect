import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import PriorityBadge from '../../components/PriorityBadge.jsx';
import ComplaintDetailModal from '../../components/ComplaintDetailModal.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import { 
  Users, 
  ClipboardList, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  BarChart3, 
  Download, 
  PlusCircle, 
  ArrowRight,
  ShieldAlert,
  Activity,
  Megaphone
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, complaintsRes] = await Promise.all([
          api.analytics.get(),
          api.complaints.getAll()
        ]);
        if (analyticsRes.success) setAnalytics(analyticsRes);
        if (complaintsRes.success) setComplaints(complaintsRes.complaints || []);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = async () => {
    try {
      showToast('Generating complaints CSV report...', 'info');
      await api.complaints.exportCSV();
      showToast('CSV report downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to export CSV report', 'error');
    }
  };

  if (loading) {
    return <LoadingSkeleton count={4} height="90px" />;
  }

  const stats = analytics?.stats || {
    totalStudents: 3,
    totalComplaints: complaints.length,
    pendingComplaints: 2,
    inProgressComplaints: 1,
    resolvedComplaints: 2,
    totalEvents: 3,
    avgResolutionHours: '24.5 hrs'
  };

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-title">Administrator Command Center 🛡️</h1>
          <p className="welcome-subtitle">
            Overview of campus facility health, live student complaints, event operations, and system logs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={16} /> Export CSV Report
          </button>
          <Link to="/admin/complaints" className="btn btn-primary">
            <ClipboardList size={16} /> Manage Complaints
          </Link>
        </div>
      </div>

      {/* Metrics Stat Grid */}
      <div className="stat-grid">
        <StatCard
          title="Registered Students"
          value={stats.totalStudents}
          icon={Users}
          meta="Active college accounts"
          color="var(--primary)"
          bgLight="var(--primary-light)"
        />
        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
          icon={ClipboardList}
          meta="All departments"
          color="#6366f1"
          bgLight="rgba(99, 102, 241, 0.15)"
        />
        <StatCard
          title="Pending / Under Review"
          value={stats.pendingComplaints}
          icon={Clock}
          meta="Requires triage"
          color="var(--status-submitted)"
          bgLight="var(--status-submitted-bg)"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressComplaints}
          icon={AlertCircle}
          meta="Dispatched technicians"
          color="var(--status-progress)"
          bgLight="var(--status-progress-bg)"
        />
        <StatCard
          title="Resolved"
          value={stats.resolvedComplaints}
          icon={CheckCircle2}
          meta="Verified complete"
          color="var(--status-resolved)"
          bgLight="var(--status-resolved-bg)"
        />
        <StatCard
          title="Avg Resolution Time"
          value={stats.avgResolutionHours}
          icon={Activity}
          meta="SLA performance"
          color="#0ea5e9"
          bgLight="rgba(14, 165, 233, 0.15)"
        />
      </div>

      {/* Quick Actions Strip */}
      <div className="quick-actions-bar">
        <span className="quick-actions-label">Admin Management:</span>
        <Link to="/admin/complaints" className="btn btn-secondary btn-sm">
          <ClipboardList size={15} /> All Complaints ({complaints.length})
        </Link>
        <Link to="/admin/students" className="btn btn-secondary btn-sm">
          <Users size={15} /> Student Directory
        </Link>
        <Link to="/admin/announcements" className="btn btn-secondary btn-sm">
          <Megaphone size={15} /> Publish Announcement
        </Link>
        <Link to="/admin/events" className="btn btn-secondary btn-sm">
          <Calendar size={15} /> Create Campus Event
        </Link>
        <Link to="/admin/analytics" className="btn btn-secondary btn-sm">
          <BarChart3 size={15} /> Visual Charts & Analytics
        </Link>
      </div>

      {/* Split Section Layout */}
      <div className="dashboard-grid-2">
        {/* Left Column: Recent Complaints Needing Attention */}
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">
              <ClipboardList size={20} color="var(--primary)" /> Student Complaints Queue
            </h3>
            <Link to="/admin/complaints" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              Full Management <ArrowRight size={14} style={{ display: 'inline' }} />
            </Link>
          </div>
          <div className="section-card-body" style={{ padding: 0 }}>
            <div className="table-responsive" style={{ border: 'none' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Issue Title</th>
                    <th>Student</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.slice(0, 6).map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.8rem' }}>
                        {c.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          📍 {c.location}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.825rem' }}>
                        <div>{c.studentName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.studentRoll}</div>
                      </td>
                      <td>
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="btn btn-secondary btn-sm"
                        >
                          Review / Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Audit Logs */}
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">
              <Activity size={19} color="var(--status-progress)" /> Recent Audit Trail
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live Logs</span>
          </div>
          <div className="section-card-body">
            <div className="activity-list">
              {(analytics?.recentActivities || []).slice(0, 6).map((act) => (
                <div key={act.id} className="activity-item">
                  <div 
                    className="activity-dot" 
                    style={{ 
                      backgroundColor: act.action.includes('RESOLVED') 
                        ? 'var(--status-resolved)' 
                        : act.action.includes('DELETE')
                        ? 'var(--status-rejected)'
                        : 'var(--primary)' 
                    }} 
                  />
                  <div className="activity-content">
                    <div className="activity-title">{act.performedBy}</div>
                    <div className="activity-desc">
                      <strong>{act.target}:</strong> {act.details}
                    </div>
                    <div className="activity-time">
                      {new Date(act.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

export default AdminDashboard;

