import React from 'react';
import './Hero.css';

interface HeroProps {
  greeting: string;
  headline: string;
  subline: string;
  workLink: {
    label: string;
    href: string;
  };
}

export const Hero: React.FC<HeroProps> = ({
  greeting,
  headline,
  subline,
  workLink,
}) => {
  return (
    <section className="hero-section" aria-label="Introduction">
      {/* Slow, ambient animated atmospheric background specifically for the Hero */}
      <div className="hero-ambient" aria-hidden="true">
        <div className="hero-aura hero-aura-primary" />
        <div className="hero-aura hero-aura-secondary" />
        <div className="hero-aura hero-aura-tertiary" />
        <div className="hero-grain" />
      </div>

      <div className="site-wrapper hero-container">
        {/* Step 2: "Hi, I'm David." */}
        <p className="hero-greeting hero-animate-1">{greeting}</p>

        {/* Step 3: Main personal headline */}
        <h1 className="hero-headline hero-animate-2">{headline}</h1>

        {/* Step 4: Supporting sentence */}
        <p className="hero-subline hero-animate-3">{subline}</p>

        {/* Step 5: Work navigation */}
        <div className="hero-actions hero-animate-4">
          <a href={workLink.href} className="hero-link">
            {workLink.label}
          </a>
        </div>
      </div>
    </section>
  );
};
