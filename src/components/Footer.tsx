import React from 'react';
import './Footer.css';

interface FooterProps {
  copyright: string;
  isRevealed?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  copyright,
  isRevealed = true,
}) => {
  return (
    <footer className={`site-footer ${isRevealed ? 'is-revealed' : ''}`}>
      <div className="site-wrapper footer-inner">
        <p className="copyright-text">{copyright}</p>
      </div>
    </footer>
  );
};
