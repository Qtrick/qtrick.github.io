import React from 'react';
import './Sections.css';

interface AboutProps {
  sectionTitle: string;
  sectionEyebrow: string;
  paragraphs: string[];
}

export const About: React.FC<AboutProps> = ({
  sectionTitle,
  sectionEyebrow,
  paragraphs,
}) => {
  return (
    <section className="site-section" id="about" aria-label={sectionTitle}>
      <div className="site-wrapper">
        <div className="section-header">
          <span className="section-eyebrow">{sectionEyebrow}</span>
          <h2 className="section-title">{sectionTitle}</h2>
        </div>

        <div className="about-content">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="about-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
