import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusClass = (st) => {
    switch (st?.toLowerCase()) {
      case 'submitted':
        return 'status-submitted';
      case 'under review':
        return 'status-under-review';
      case 'in progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-submitted';
    }
  };

  return (
    <span className={`badge ${getStatusClass(status)}`}>
      <span 
        style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          backgroundColor: 'currentColor' 
        }} 
      />
      {status || 'Submitted'}
    </span>
  );
};

export default StatusBadge;

