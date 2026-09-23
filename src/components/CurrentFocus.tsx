import React from 'react';
import './Sections.css';

interface CurrentFocusProps {
  sectionTitle: string;
  sectionEyebrow: string;
  intro: string;
  focusList: string[];
}

export const CurrentFocus: React.FC<CurrentFocusProps> = ({
  sectionTitle,
  sectionEyebrow,
  intro,
  focusList,
}) => {
  return (
    <section className="site-section" id="now" aria-label={sectionTitle}>
      <div className="site-wrapper">
        <div className="section-header">
          <span className="section-eyebrow">{sectionEyebrow}</span>
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-description">{intro}</p>
        </div>

        <div className="focus-card">
          <ul className="focus-list">
            {focusList.map((item, index) => (
              <li key={index} className="focus-item">
                <span className="focus-indicator" aria-hidden="true">
                  0{index + 1}
                </span>
                <p className="focus-text">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
