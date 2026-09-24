import React, { useMemo } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SmoothTextReveal, calculateSequentialDelays } from './SmoothTextReveal';
import './AboutSection.css';

interface AboutSectionProps {
  sectionTitle: string;
  bio: string[];
  enabled?: boolean;
  onRevealed?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  sectionTitle,
  bio,
  enabled = true,
  onRevealed,
}) => {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({
    enabled,
    onReveal: onRevealed,
  });

  // Strictly sequential delays: bio[1] waits for bio[0] to fully finish
  const bioDelays = useMemo(() => {
    return calculateSequentialDelays(bio, {
      initialDelay: 0.06,
      charSpeed: 0.012,
      fadeDuration: 0.18,
      pauseBetween: 0.05,
    });
  }, [bio]);

  return (
    <section
      ref={ref}
      id="about"
      className={`about-section ${isRevealed ? 'is-revealed' : ''}`}
      aria-label={sectionTitle}
    >
      <div className="site-wrapper">
        <div className="about-container">
          <h2 className="about-title reveal-item about-title-item">
            {sectionTitle}
          </h2>

          <div className="about-bio-text">
            {bio.map((paragraph, idx) => (
              <p
                key={idx}
                className={`about-paragraph reveal-item about-paragraph-${idx + 1}`}
              >
                <SmoothTextReveal
                  text={paragraph}
                  baseDelay={bioDelays[idx]}
                  charSpeed={0.012}
                  animate={isRevealed}
                />
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
