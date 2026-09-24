import React from 'react';
import './AmbientBackground.css';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      <div className="ambient-grain" />
    </div>
  );
};
