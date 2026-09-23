import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { PreBaseVisual } from './PreBaseVisual';
import { CoresideVisual } from './CoresideVisual';
import './WorkSection.css';

interface WorkSectionProps {
  sectionTitle: string;
  projects: ProjectItem[];
}

export const WorkSection: React.FC<WorkSectionProps> = ({
  sectionTitle,
  projects,
}) => {
  const [activeId, setActiveId] = useState<string>(projects[0]?.id || 'prebase');

  const activeProject = projects.find((p) => p.id === activeId) || projects[0];

  return (
    <section id="work" className="work-section" aria-label={sectionTitle}>
      <div className="site-wrapper">
        <div className="work-header">
          <h2 className="work-title">{sectionTitle}</h2>

          {/* Project Toggle */}
          <div className="project-toggle" role="tablist" aria-label="Selected Projects">
            {projects.map((project) => {
              const isSelected = project.id === activeId;
              return (
                <button
                  key={project.id}
                  id={`tab-${project.id}`}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-${project.id}`}
                  className={`toggle-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveId(project.id)}
                >
                  {project.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Project Display */}
        <div
          key={activeProject.id}
          id={`panel-${activeProject.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeProject.id}`}
          className="project-display-panel"
        >
          {/* Visual Showcase */}
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
