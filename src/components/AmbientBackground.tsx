import React from 'react';
import './AmbientBackground.css';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-mesh" />
      <div className="ambient-grain" />
    </div>
  );
};
