import React, { useMemo } from 'react';
import { SmoothTextReveal, calculateSequentialDelays } from './SmoothTextReveal';
import './Hero.css';

interface HeroProps {
  greeting: string;
  headline: string;
  subline: string;
}

export const Hero: React.FC<HeroProps> = ({
  greeting,
  headline,
  subline,
}) => {
  // Strictly sequential delays: each text waits for the prior text to fully finish
  const [greetingDelay, headlineDelay, sublineDelay] = useMemo(() => {
    return calculateSequentialDelays([greeting, headline, subline], {
      initialDelay: 0.08,
      charSpeed: 0.015,
      fadeDuration: 0.18,
      pauseBetween: 0.04,
    });
  }, [greeting, headline, subline]);

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
        <p className="hero-greeting">
          <SmoothTextReveal
            text={greeting}
            baseDelay={greetingDelay}
            charSpeed={0.016}
          />
        </p>

        {/* Step 3: Main personal headline - strictly waits for greeting to finish */}
        <h1 className="hero-headline">
          <SmoothTextReveal
            text={headline}
            baseDelay={headlineDelay}
            charSpeed={0.015}
          />
        </h1>

        {/* Step 4: Supporting sentence - strictly waits for headline to finish */}
        <p className="hero-subline">
          <SmoothTextReveal
            text={subline}
            baseDelay={sublineDelay}
            charSpeed={0.015}
          />
        </p>
      </div>
    </section>
  );
};

