import React from 'react';

const PriorityBadge = ({ priority }) => {
  const getPriorityClass = (pr) => {
    switch (pr?.toLowerCase()) {
      case 'low':
        return 'priority-low';
      case 'medium':
        return 'priority-medium';
      case 'high':
        return 'priority-high';
      case 'urgent':
        return 'priority-urgent';
      default:
        return 'priority-medium';
    }
  };

  return (
    <span className={`badge ${getPriorityClass(priority)}`}>
      {priority || 'Medium'}
    </span>
  );
};

export default PriorityBadge;

