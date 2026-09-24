import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { NavItem, SocialLinks } from '../types';
import { GitHubIcon, LinkedInIcon } from './Icons';
import './Header.css';

interface HeaderProps {
  ownerName: string;
  navigation: NavItem[];
  social: SocialLinks;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  ownerName,
  navigation,
  social,
  theme,
  onToggleTheme,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(social.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
      throw new Error('Clipboard API not available');
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = social.email;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return;
        }
        window.location.href = `mailto:${social.email}`;
      } catch {
        window.location.href = `mailto:${social.email}`;
      }
    }
  };

  return (
    <header className={`site-header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="site-wrapper header-inner">
        {/* Left Side: Logo & Primary Section Navigation */}
        <div className="header-left">
          <a
            href="#main-content"
            className="site-logo"
            aria-label={`${ownerName} home`}
          >
            {ownerName}
          </a>

          <nav className="header-nav" aria-label="Main Navigation">
            <ul className="nav-list">
              {navigation.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right Side: Email, Global Social Icons, and Theme Toggle */}
        <div className="header-right">
          <div className="header-email-group">
            <span className="header-email-label">Email:</span>
            <a
              href={`mailto:${social.email}`}
              className="header-email-link"
              aria-label={`Send email to ${social.email}`}
            >
              {social.email}
            </a>
            <button
              type="button"
              className="header-copy-btn"
              onClick={handleCopyEmail}
              aria-label="Copy email address to clipboard"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="header-action-icons">
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="header-icon-link"
              aria-label="GitHub profile (opens in new tab)"
              title="GitHub"
            >
              <GitHubIcon size={17} />
            </a>

            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="header-icon-link"
              aria-label="LinkedIn profile (opens in new tab)"
              title="LinkedIn"
            >
              <LinkedInIcon size={17} />
            </a>

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? (
                <Sun size={16} aria-hidden="true" />
              ) : (
                <Moon size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
