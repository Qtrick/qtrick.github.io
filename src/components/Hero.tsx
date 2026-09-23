import React from 'react';
import { ArrowDown, ExternalLink } from 'lucide-react';
import './Hero.css';

interface HeroProps {
  name: string;
  headline: string;
  subheadline: string;
  bioLine: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
}

export const Hero: React.FC<HeroProps> = ({
  name,
  headline,
  subheadline,
  bioLine,
  primaryCta,
  secondaryCta,
}) => {
  return (
    <section className="hero-section" id="top" aria-label="Introduction">
      <div className="site-wrapper hero-grid">
        <div className="hero-content">
          <div className="hero-badge-wrap">
            <span className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true"></span>
              Freshman · UMass Amherst
            </span>
          </div>

          <h1 className="hero-name">{name}</h1>
          <p className="hero-headline">{headline}</p>

          <p className="hero-bio">{subheadline}</p>
          <p className="hero-subbio">{bioLine}</p>

          <div className="hero-actions">
            <a href={primaryCta.href} className="btn btn-primary hero-primary-btn">
              <span>{primaryCta.text}</span>
              <ArrowDown size={14} aria-hidden="true" />
            </a>

            <a
              href={secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary hero-secondary-btn"
            >
              <span>{secondaryCta.text}</span>
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Right Column: Restrained System Architecture Motif */}
        <div className="hero-visual-col" aria-label="Core Projects Overview">
          <div className="hero-architecture-card">
            <div className="architecture-header">
              <span className="arch-tag">System Map</span>
              <div className="arch-title">David Fan</div>
              <div className="arch-subtitle">UMass '26 · Biology &amp; Systems</div>
            </div>

            <div className="architecture-tree">
              <a href="#project-prebase" className="arch-branch">
                <span className="branch-indicator">01</span>
                <div className="branch-info">
                  <span className="branch-name">
                    PreBase
                    <ArrowDown size={12} aria-hidden="true" style={{ transform: 'rotate(-45deg)' }} />
                  </span>
                  <span className="branch-desc">Codebase-mapping &amp; spatial architecture IDE</span>
                  <span className="branch-tech">Code-OSS · TypeScript · Electron · Graphs</span>
                </div>
              </a>

              <a href="#project-coreside" className="arch-branch">
                <span className="branch-indicator">02</span>
                <div className="branch-info">
                  <span className="branch-name">
                    Coreside
                    <ArrowDown size={12} aria-hidden="true" style={{ transform: 'rotate(-45deg)' }} />
                  </span>
                  <span className="branch-desc">Personal software environment with persistent tools</span>
                  <span className="branch-tech">Tauri 2 · Rust · React · SQLite</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
