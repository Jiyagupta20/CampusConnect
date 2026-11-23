import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import PriorityBadge from '../../components/PriorityBadge.jsx';
import ComplaintDetailModal from '../../components/ComplaintDetailModal.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  Megaphone, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  HelpCircle,
  FileText
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [complaintsRes, announcementsRes, eventsRes] = await Promise.all([
          api.complaints.getAll(),
          api.announcements.getAll(),
          api.events.getAll({ filter: 'upcoming' })
        ]);

        if (complaintsRes.success) setComplaints(complaintsRes.complaints || []);
        if (announcementsRes.success) setAnnouncements(announcementsRes.announcements || []);
        if (eventsRes.success) setEvents(eventsRes.events || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalSubmitted = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  if (loading) {
    return <LoadingSkeleton count={4} height="90px" />;
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-title">
            Welcome back, {user?.fullName || 'Student'}! 👋
          </h1>
          <p className="welcome-subtitle">
            {user?.department || 'Student Portal'} • ID: {user?.studentId || 'N/A'} • {user?.yearSemester || 'Academic Year'}
          </p>
        </div>
        <Link to="/student/report" className="btn btn-primary">
          <PlusCircle size={18} /> Report an Issue
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-grid">
        <StatCard
          title="Total Issues Logged"
          value={totalSubmitted}
          icon={FileText}
          meta="All time submissions"
          color="var(--primary)"
          bgLight="var(--primary-light)"
        />
        <StatCard
          title="Pending Review"
          value={pendingCount}
          icon={Clock}
          meta="Awaiting department review"
          color="var(--status-submitted)"
          bgLight="var(--status-submitted-bg)"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          icon={AlertCircle}
          meta="Technician assigned on site"
          color="var(--status-progress)"
          bgLight="var(--status-progress-bg)"
        />
        <StatCard
          title="Resolved Issues"
          value={resolvedCount}
          icon={CheckCircle2}
          meta="Verified complete"
          color="var(--status-resolved)"
          bgLight="var(--status-resolved-bg)"
        />
      </div>

      {/* Quick Actions Strip */}
      <div className="quick-actions-bar">
        <span className="quick-actions-label">Quick Actions:</span>
        <Link to="/student/report" className="btn btn-secondary btn-sm">
          <PlusCircle size={15} color="var(--primary)" /> Report Campus Problem
        </Link>
        <Link to="/student/complaints" className="btn btn-secondary btn-sm">
          <FileText size={15} /> Track My Complaints
        </Link>
        <Link to="/student/lost-found" className="btn btn-secondary btn-sm">
          <HelpCircle size={15} /> Lost & Found
        </Link>
        <Link to="/student/map" className="btn btn-secondary btn-sm">
          <MapPin size={15} /> Campus Interactive Map
        </Link>
      </div>

      {/* Split Section Layout */}
      <div className="dashboard-grid-2">
        {/* Left Column: Recent Complaint Activity */}
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">
              <AlertCircle size={20} color="var(--primary)" /> Recent Complaint Activity
            </h3>
            <Link to="/student/complaints" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All <ArrowRight size={14} style={{ display: 'inline' }} />
            </Link>
          </div>
          <div className="section-card-body" style={{ padding: 0 }}>
            {complaints.length === 0 ? (
              <EmptyState
                title="No complaints submitted yet"
                message="If you notice any electrical, Wi-Fi, lab, or cleanliness issues around campus, report them now."
                actionButton={
                  <Link to="/student/report" className="btn btn-primary btn-sm">
                    Submit First Complaint
                  </Link>
                }
              />
            ) : (
              <div className="table-responsive" style={{ border: 'none' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Complaint ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.slice(0, 5).map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.825rem' }}>
                          {c.id}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {c.title}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                          {c.category}
                        </td>
                        <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                          {c.location}
                        </td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="btn btn-secondary btn-sm"
                          >
                            Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Latest Announcements & Upcoming Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Latest Announcements */}
          <div className="section-card">
            <div className="section-card-header">
              <h3 className="section-card-title">
                <Megaphone size={19} color="var(--status-submitted)" /> Announcements
              </h3>
              <Link to="/student/announcements" style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
                View All
              </Link>
            </div>
            <div className="section-card-body" style={{ padding: '16px' }}>
              {announcements.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '16px' }}>
                  No active announcements.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {announcements.slice(0, 3).map((a) => (
                    <div 
                      key={a.id} 
                      style={{ 
                        padding: '12px', 
                        borderRadius: 'var(--radius-md)', 
                        background: a.isImportant ? 'var(--status-submitted-bg)' : 'var(--bg-tertiary)',
                        borderLeft: a.isImportant ? '3px solid var(--status-submitted)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {a.category}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {new Date(a.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '4px' }}>
                        {a.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {a.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events Mini Widget */}
          <div className="section-card">
            <div className="section-card-header">
              <h3 className="section-card-title">
                <Calendar size={19} color="var(--status-progress)" /> Upcoming Events
              </h3>
              <Link to="/student/events" style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
                Explore
              </Link>
            </div>
            <div className="section-card-body" style={{ padding: '16px' }}>
              {events.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '16px' }}>
                  No upcoming events scheduled.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {events.slice(0, 2).map((ev) => (
                    <div 
                      key={ev.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        padding: '10px', 
                        borderRadius: 'var(--radius-md)', 
                        background: 'var(--bg-tertiary)' 
                      }}
                    >
                      <div style={{ 
                        background: 'var(--primary-light)', 
                        color: 'var(--primary)', 
                        padding: '8px 10px', 
                        borderRadius: 'var(--radius-sm)', 
                        textAlign: 'center',
                        minWidth: '50px'
                      }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1 }}>
                          {new Date(ev.eventDate).getDate()}
                        </div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                          {new Date(ev.eventDate).toLocaleString('default', { month: 'short' })}
                        </div>
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ev.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          📍 {ev.venue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

export default StudentDashboard;

