import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { Calendar, Clock, MapPin, Users, ExternalLink, CheckCircle } from 'lucide-react';

const StudentEvents = () => {
  const { showToast } = useNotification();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [registeringId, setRegisteringId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.events.getAll({ filter });
      if (res.success) setEvents(res.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const handleRegisterRSVP = async (event) => {
    setRegisteringId(event.id);
    try {
      const res = await api.events.register(event.id);
      if (res.success) {
        showToast(`You have successfully RSVP'd for "${event.name}"!`, 'success');
        setEvents(prev => prev.map(e => e.id === event.id ? { ...e, attendeesCount: (e.attendeesCount || 0) + 1 } : e));
      }
    } catch (err) {
      showToast(err.message || 'Failed to RSVP', 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div>
      <div className="module-header-actions">
        <div>
          <h1 className="welcome-title">College Events & Hackathons</h1>
          <p className="welcome-subtitle">
            Stay updated with upcoming cultural festivals, technical hackathons, expert talks, and sports meets.
          </p>
        </div>

        {/* Filter Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${filter === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            className={`btn btn-sm ${filter === 'past' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('past')}
          >
            Past Events
          </button>
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All Events
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="220px" />
      ) : events.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No events scheduled"
            message="Check back soon for new college announcements and competition schedules."
          />
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            const dateObj = new Date(event.eventDate);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString('default', { month: 'short' });

            return (
              <div key={event.id} className="event-card">
                <div className="event-image-box">
                  <img src={event.imageUrl} alt={event.name} className="event-img" />
                  <div className="event-date-badge">
                    <div className="event-date-day">{day}</div>
                    <div className="event-date-month">{month}</div>
                  </div>
                </div>

                <div className="event-card-body">
                  <span className="badge" style={{ alignSelf: 'flex-start', background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '8px' }}>
                    {event.category || 'College Event'}
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
                      <span>{event.attendeesCount || 0} attending</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span><strong>Venue:</strong> {event.venue}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleRegisterRSVP(event)}
                      disabled={registeringId === event.id}
                    >
                      <CheckCircle size={15} /> {registeringId === event.id ? 'Registering...' : 'RSVP / Register'}
                    </button>
                    {event.registrationLink && (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        title="External Registration Link"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentEvents;

