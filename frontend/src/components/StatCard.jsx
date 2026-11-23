import React from 'react';

const StatCard = ({ title, value, icon: Icon, meta, color = 'var(--primary)', bgLight = 'var(--primary-light)' }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
        {meta && <span className="stat-meta">{meta}</span>}
      </div>
      <div className="stat-icon-wrapper" style={{ backgroundColor: bgLight, color: color }}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;

