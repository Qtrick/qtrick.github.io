import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
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
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
