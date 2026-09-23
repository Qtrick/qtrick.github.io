import React from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import { GithubIcon } from './Icons';
import { SocialLink } from '../types';
import './Footer.css';

interface FooterProps {
  ownerName: string;
  copyright: string;
  links: SocialLink[];
}

export const Footer: React.FC<FooterProps> = ({ ownerName, copyright, links }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-wrapper footer-content">
        <div className="footer-left">
          <span className="footer-copyright">
            {ownerName} · {copyright}
          </span>
          <span className="footer-note">Built with React &amp; TypeScript · Hosted on GitHub Pages</span>
        </div>

        <div className="footer-right">
          <nav className="footer-links" aria-label="Footer Navigation">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                {link.icon === 'github' && <GithubIcon size={13} aria-hidden="true" />}
                {link.icon === 'mail' && <Mail size={13} aria-hidden="true" />}
                <span>{link.label}</span>
              </a>
            ))}
            <button
              type="button"
              className="footer-link scroll-top-btn"
              onClick={scrollToTop}
              aria-label="Scroll back to top of page"
            >
              <span>Top</span>
              <ArrowUp size={13} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};
