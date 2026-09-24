import React, { useState } from 'react';
import { SocialLink } from '../types';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './AboutSection.css';

interface AboutSectionProps {
  sectionTitle: string;
  bio: string[];
  email: string;
  links: SocialLink[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  sectionTitle,
  bio,
  email,
  links,
}) => {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section
      ref={ref}
      id="about"
      className={`about-section reveal-on-scroll ${isRevealed ? 'is-revealed' : ''}`}
      aria-label={sectionTitle}
    >
      <div className="site-wrapper">
        <div className="about-container">
          <h2 className="about-title">{sectionTitle}</h2>

          <div className="about-bio-text">
            {bio.map((paragraph, idx) => (
              <p key={idx} className="about-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="about-links-row">
            <div className="about-social-links">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="about-link"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>

            <div className="about-email-wrapper">
              <a href={`mailto:${email}`} className="email-mailto-link">
                {email}
              </a>
              <button
                type="button"
                className="email-copy-btn"
                onClick={handleCopyEmail}
                aria-label="Copy email address to clipboard"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
