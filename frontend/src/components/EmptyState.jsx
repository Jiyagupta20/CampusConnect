import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({ icon: Icon = FileQuestion, title = 'No records found', message, actionButton }) => {
  return (
    <div className="empty-state">
      <Icon className="empty-state-icon" />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

export default EmptyState;

