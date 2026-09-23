import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { NavItem } from '../types';
import './Header.css';

interface HeaderProps {
  ownerName: string;
  navigation: NavItem[];
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  ownerName,
  navigation,
  theme,
  onToggleTheme,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="site-wrapper header-inner">
        <a href="#main-content" className="site-logo" aria-label={`${ownerName} home`}>
          {ownerName}
        </a>

        <nav className="header-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navigation.map((item) => {
              const isExternal = item.href.startsWith('http');
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="nav-link"
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {item.label}
                    {isExternal && <span className="external-arrow"> ↗</span>}
                  </a>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? (
                  <Sun size={15} aria-hidden="true" />
                ) : (
                  <Moon size={15} aria-hidden="true" />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
