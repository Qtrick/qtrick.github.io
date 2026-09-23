import React from 'react';
import { OutsideItem } from '../types';
import './Sections.css';

interface OutsideSoftwareProps {
  sectionTitle: string;
  sectionEyebrow: string;
  intro: string;
  items: OutsideItem[];
}

export const OutsideSoftware: React.FC<OutsideSoftwareProps> = ({
  sectionTitle,
  sectionEyebrow,
  intro,
  items,
}) => {
  return (
    <section className="site-section" id="outside" aria-label={sectionTitle}>
      <div className="site-wrapper">
        <div className="section-header">
          <span className="section-eyebrow">{sectionEyebrow}</span>
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-description">{intro}</p>
        </div>

        <div className="outside-grid">
          {items.map((item, index) => (
            <article key={index} className="outside-card">
              <div className="outside-card-header">
                <span className="outside-role">{item.role}</span>
                <h3 className="outside-title">{item.title}</h3>
              </div>
              <p className="outside-desc">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
