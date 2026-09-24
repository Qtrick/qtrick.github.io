import React from 'react';
import { ProjectItem } from '../types';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { GitHubIcon, GlobeIcon } from './Icons';
import './WorkSection.css';

interface WorkSectionProps {
  sectionTitle: string;
  projects: ProjectItem[];
  enabled?: boolean;
  onRevealed?: () => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({
  sectionTitle,
  projects,
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
      id="work"
      className={`work-section ${isRevealed ? 'is-revealed' : ''}`}
      aria-label={sectionTitle}
    >
      <div className="site-wrapper">
        <h2 className="work-title reveal-item work-title-item">{sectionTitle}</h2>

        <ul className="project-list" aria-label="Projects">
          {projects.map((project, idx) => (
            <li
              key={project.id}
              className={`project-item reveal-item project-item-${idx + 1}`}
            >
              <div className="project-item-header">
                <h3 className="project-name">{project.name}</h3>
                {project.descriptor && (
                  <span className="project-descriptor">{project.descriptor}</span>
                )}
              </div>

              <p className="project-description">{project.description}</p>

              <div
                className="project-icon-links"
                aria-label={`${project.name} project links`}
              >
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-icon-link"
                  aria-label={`${project.name} GitHub repository (opens in new tab)`}
                  title={`${project.name} GitHub repository`}
                >
                  <GitHubIcon size={18} />
                </a>

                {project.websiteUrl && (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-icon-link"
                    aria-label={`${project.name} website (opens in new tab)`}
                    title={`${project.name} website`}
                  >
                    <GlobeIcon size={18} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
