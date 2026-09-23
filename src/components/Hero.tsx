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
        {/* Name / Greeting */}
        <p className="hero-name animate-enter delay-1">{name}</p>

        {/* Main Personal Headline */}
        <h1 className="hero-headline animate-enter delay-2">{headline}</h1>

        {/* Supporting Line */}
        <p className="hero-subline animate-enter delay-3">{subline}</p>

        {/* Action Links */}
        <div className="hero-actions animate-enter delay-4">
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
