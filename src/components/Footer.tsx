import React from 'react';
import './Footer.css';

interface FooterProps {
  copyright: string;
}

export const Footer: React.FC<FooterProps> = ({ copyright }) => {
  return (
    <footer className="site-footer">
      <div className="site-wrapper footer-inner">
        <p className="footer-copyright">{copyright}</p>
      </div>
    </footer>
  );
};
