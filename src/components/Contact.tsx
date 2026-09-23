import React, { useState } from 'react';
import { Mail, Check, Copy, ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';
import { SocialLink } from '../types';
import './Sections.css';

interface ContactProps {
  sectionTitle: string;
  sectionEyebrow: string;
  headline: string;
  body: string;
  email: string;
  socials: SocialLink[];
}

export const Contact: React.FC<ContactProps> = ({
  sectionTitle,
  sectionEyebrow,
  headline,
  body,
  email,
  socials,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers or restricted permissions
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="site-section contact-section" id="contact" aria-label={sectionTitle}>
      <div className="site-wrapper">
        <div className="contact-box">
          <div className="section-header">
            <span className="section-eyebrow">{sectionEyebrow}</span>
            <h2 className="section-title">{headline}</h2>
            <p className="section-description">{body}</p>
          </div>

          <div className="contact-action-row">
            <a
              href={`mailto:${email}`}
              className="btn btn-primary contact-main-btn"
              aria-label={`Send email to ${email}`}
            >
              <Mail size={16} aria-hidden="true" />
              <span>{email}</span>
            </a>

            <button
              type="button"
              className="btn btn-secondary contact-copy-btn"
              onClick={handleCopyEmail}
              aria-label={copied ? 'Email address copied' : 'Copy email address to clipboard'}
            >
              {copied ? (
                <>
                  <Check size={15} color="#22c55e" aria-hidden="true" />
                  <span style={{ color: '#22c55e' }}>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={15} aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="contact-links-row">
            <span className="contact-links-label">Also find me at:</span>
            <div className="contact-social-pills">
              {socials.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill"
                >
                  {link.icon === 'github' && <GithubIcon size={14} aria-hidden="true" />}
                  {link.icon === 'mail' && <Mail size={14} aria-hidden="true" />}
                  <span>{link.label}</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
