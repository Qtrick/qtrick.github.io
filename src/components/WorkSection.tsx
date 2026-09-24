import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { PreBaseVisual } from './PreBaseVisual';
import { CoresideVisual } from './CoresideVisual';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './WorkSection.css';

interface WorkSectionProps {
  sectionTitle: string;
  projects: ProjectItem[];
}

export const WorkSection: React.FC<WorkSectionProps> = ({
  sectionTitle,
  projects,
}) => {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>();
  const [activeId, setActiveId] = useState<string>(projects[0]?.id || 'prebase');
  const [isAnimating, setIsAnimating] = useState(false);

  const activeProject =
    projects.find((p) => p.id === activeId) || projects[0];

  const handleTabChange = (newId: string) => {
    if (newId === activeId) return;
    setActiveId(newId);
    setIsAnimating(true);
  };

  return (
    <section
      ref={ref}
      id="work"
      className={`work-section reveal-on-scroll ${isRevealed ? 'is-revealed' : ''}`}
      aria-label={sectionTitle}
    >
      <div className="site-wrapper">
        <div className="work-header">
          <h2 className="work-title">{sectionTitle}</h2>

          {/* Project Toggle Tabs */}
          <div className="project-toggle" role="tablist" aria-label="Selected Projects">
            {projects.map((project) => {
              const isSelected = project.id === activeId;
              return (
                <button
                  key={project.id}
                  id={`tab-${project.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-${project.id}`}
                  className={`toggle-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => handleTabChange(project.id)}
                >
                  {project.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stable Project Display Panel (Smooth transition without key remounting) */}
        <div
          id={`panel-${activeProject.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeProject.id}`}
          className={`project-display-panel ${isAnimating ? 'is-animating' : ''}`}
          onAnimationEnd={() => setIsAnimating(false)}
        >
          {/* Visual Showcase Canvas */}
          <div className="project-visual-wrapper">
            {activeProject.id === 'prebase' ? (
              <PreBaseVisual />
            ) : (
              <CoresideVisual />
            )}
          </div>

          {/* Project Information */}
          <div className="project-meta-wrapper">
            <div className="project-header-row">
              <h3 className="project-name">{activeProject.name}</h3>
              <span className="project-role-badge">
                {activeProject.role} · {activeProject.status}
              </span>
            </div>

            <p className="project-tagline">{activeProject.tagline}</p>
            <p className="project-description">{activeProject.description}</p>

            <div className="project-footer-row">
              <div className="project-tech-list">
                {activeProject.technologies.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={activeProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-github-link"
                aria-label={`View ${activeProject.name} repository on GitHub (opens in new tab)`}
              >
                GitHub →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
