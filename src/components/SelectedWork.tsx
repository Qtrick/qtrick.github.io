import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GithubIcon } from './Icons';
import { ProjectData } from '../types';
import { PreBaseGraphVisual } from './PreBaseGraphVisual';
import { CoresidePipelineVisual } from './CoresidePipelineVisual';
import './SelectedWork.css';

interface SelectedWorkProps {
  sectionTitle: string;
  sectionEyebrow: string;
  sectionDescription: string;
  projects: ProjectData[];
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  sectionTitle,
  sectionEyebrow,
  sectionDescription,
  projects,
}) => {
  // Allow toggling expanded state per project
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    prebase: false,
    coreside: false,
  });

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="work-section" id="work" aria-label={sectionTitle}>
      <div className="site-wrapper">
        <div className="section-header">
          <span className="section-eyebrow">{sectionEyebrow}</span>
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-description">{sectionDescription}</p>
        </div>

        <div className="projects-list">
          {projects.map((project, index) => {
            const isExpanded = !!expandedProjects[project.id];
            const detailId = `project-detail-${project.id}`;

            return (
              <article
                key={project.id}
                id={`project-${project.id}`}
                className="project-panel"
                aria-labelledby={`heading-${project.id}`}
              >
                <div className="project-grid">
                  {/* Left Column: Core Identity & Narrative */}
                  <div className="project-main-col">
                    <div className="project-meta-row">
                      <span className="project-index">0{index + 1}</span>
                      <span className="status-badge">
                        <span className="status-dot"></span>
                        {project.status}
                      </span>
                      <span className="project-role">{project.role}</span>
                    </div>

                    <div className="project-titles">
                      <span className="project-eyebrow-text">{project.eyebrow}</span>
                      <h3 id={`heading-${project.id}`} className="project-name">
                        {project.name}
                      </h3>
                    </div>

                    <p className="project-tagline">{project.tagline}</p>
                    <p className="project-overview">{project.overview}</p>

                    <div className="project-technologies" aria-label="Technologies used">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="project-actions">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary project-action-btn"
                        aria-label={`View ${project.name} repository on GitHub (opens in new tab)`}
                      >
                        <GithubIcon size={15} aria-hidden="true" />
                        <span>Source Code</span>
                      </a>

                      <button
                        type="button"
                        className="btn btn-ghost project-expand-btn"
                        onClick={() => toggleProject(project.id)}
                        aria-expanded={isExpanded}
                        aria-controls={detailId}
                      >
                        <span>{isExpanded ? 'Hide Architecture' : 'Technical Architecture'}</span>
                        {isExpanded ? (
                          <ChevronUp size={15} aria-hidden="true" />
                        ) : (
                          <ChevronDown size={15} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Interactive Project Visual */}
                  <div className="project-visual-col">
                    {project.visualType === 'prebase-graph' && <PreBaseGraphVisual />}
                    {project.visualType === 'coreside-flow' && <CoresidePipelineVisual />}
                  </div>
                </div>

                {/* Expandable Technical Deep Dive */}
                {isExpanded && (
                  <div id={detailId} className="project-expanded-panel">
                    <div className="expanded-inner">
                      <div className="expanded-section">
                        <h4 className="expanded-heading">Why I Built This</h4>
                        <p className="expanded-body">{project.whyBuilt}</p>
                      </div>

                      <div className="expanded-section">
                        <h4 className="expanded-heading">What I Built & Contributed</h4>
                        <ul className="expanded-list">
                          {project.whatBuilt.map((item, idx) => (
                            <li key={idx} className="expanded-list-item">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="expanded-section">
                        <h4 className="expanded-heading">Key Architectural Decisions</h4>
                        <div className="decisions-grid">
                          {project.technicalDecisions.map((decision, dIdx) => (
                            <div key={dIdx} className="decision-card">
                              <span className="decision-label">{decision.label}</span>
                              <p className="decision-detail">{decision.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="expanded-section expanded-status-section">
                        <h4 className="expanded-heading">Current Engineering Status</h4>
                        <p className="expanded-status-text">{project.currentStatus}</p>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
