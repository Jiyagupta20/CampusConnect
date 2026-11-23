import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

const Timeline = ({ timeline = [], currentStatus }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 0' }}>
        No progress history recorded yet.
      </div>
    );
  }

  return (
    <div className="timeline-container">
      {timeline.map((step, index) => {
        const isLast = index === timeline.length - 1;
        const dateObj = new Date(step.timestamp);
        const formattedDate = !isNaN(dateObj) 
          ? dateObj.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
          : step.timestamp;

        return (
          <div key={index} className="timeline-item">
            <div className={`timeline-bullet ${isLast ? 'completed' : ''}`} />
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-status">{step.status}</span>
                <span className="timeline-date">{formattedDate}</span>
              </div>
              <p className="timeline-note">{step.note || 'Status updated.'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;

