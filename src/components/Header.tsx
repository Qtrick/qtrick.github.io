import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { GithubIcon } from './Icons';
import { NavItem } from '../types';
import './Header.css';

interface HeaderProps {
  ownerName: string;
  navigation: NavItem[];
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  githubUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  ownerName,
  navigation,
  theme,
  onToggleTheme,
  githubUrl = 'https://github.com/Qtrick',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`site-header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="site-wrapper header-inner">
        <a href="#main-content" className="site-logo" aria-label={`${ownerName} Home`}>
          <span className="logo-text">{ownerName}</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="nav-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-icon-btn"
            aria-label="GitHub Profile (opens in new tab)"
          >
            <GithubIcon size={18} aria-hidden="true" />
          </a>

          <button
            type="button"
            className="action-icon-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" id="mobile-menu">
          <nav aria-label="Mobile Navigation">
            <ul className="mobile-nav-list">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="mobile-nav-link"
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  GitHub (Qtrick)
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
