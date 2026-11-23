import React from 'react';

const LoadingSkeleton = ({ count = 3, height = '70px' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            animation: 'pulseSlow 1.5s infinite ease-in-out'
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;

