import React from 'react';
import './Hero.css';

interface HeroProps {
  name: string;
  headline: string;
  subline: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}

export const Hero: React.FC<HeroProps> = ({
  name,
  headline,
  subline,
  links,
}) => {
  return (
    <section className="hero-section" aria-label="Introduction">
      <div className="site-wrapper hero-container">
        {/* Step 2: David Fan name */}
        <p className="hero-name hero-animate-1">{name}</p>

        {/* Step 3: Main personal headline */}
        <h1 className="hero-headline hero-animate-2">{headline}</h1>

        {/* Step 4: Supporting sentence */}
        <p className="hero-subline hero-animate-3">{subline}</p>

        {/* Step 5: Hero action links */}
        <div className="hero-actions hero-animate-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="hero-link"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
