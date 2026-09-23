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
      <div className="site-wrapper hero-container">
        <div className="hero-content">
          <div className="hero-eyebrow-container">
            <span className="hero-status-pill">
              <span className="status-dot"></span>
              Freshman · UMass Amherst
            </span>
          </div>

          <h1 className="hero-name">{name}</h1>
          <p className="hero-headline">{headline}</p>

          <p className="hero-subheadline">{subheadline}</p>
          <p className="hero-bio">{bioLine}</p>

          <div className="hero-actions">
            <a href={primaryCta.href} className="btn btn-primary hero-btn">
              {primaryCta.text}
              <ArrowDown size={15} aria-hidden="true" />
            </a>

            <a
              href={secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary hero-btn"
            >
              {secondaryCta.text}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Restrained Architectural Map Motif */}
        <div className="hero-diagram" aria-hidden="true">
          <div className="diagram-card">
            <div className="diagram-node node-central">
              <span className="node-eyebrow">Builder</span>
              <span className="node-main">David Fan</span>
              <span className="node-sub">UMass '26 · Biology</span>
            </div>

            <div className="diagram-connector">
              <div className="connector-line"></div>
              <div className="connector-junction"></div>
            </div>

            <div className="diagram-branches">
              <a href="#project-prebase" className="branch-card branch-prebase">
                <div className="branch-header">
                  <span className="branch-pill">Featured 01</span>
                  <span className="branch-status">Active</span>
                </div>
                <h2 className="branch-title">PreBase</h2>
                <p className="branch-desc">Codebase mapping & spatial architecture IDE</p>
                <span className="branch-tech">Code-OSS · Electron · Graphs</span>
              </a>

              <a href="#project-coreside" className="branch-card branch-coreside">
                <div className="branch-header">
                  <span className="branch-pill">Featured 02</span>
                  <span className="branch-status">MVP</span>
                </div>
                <h2 className="branch-title">Coreside</h2>
                <p className="branch-desc">Personal software with trusted declarative tools</p>
                <span className="branch-tech">Tauri 2 · Rust · SQLite</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
