import React, { useState } from 'react';
import './ProjectVisuals.css';

interface PreBaseNode {
  id: string;
  name: string;
  sublabel: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  detail: string;
  connectedTo: string[];
}

export const PREBASE_NODES: PreBaseNode[] = [
  {
    id: 'app',
    name: 'App.tsx',
    sublabel: 'Main view',
    x: 50,
    y: 26,
    detail: 'Main view component. Imports Sidebar.tsx, UserProfile.tsx, and apiClient.ts.',
    connectedTo: ['sidebar', 'userprofile', 'apiclient'],
  },
  {
    id: 'sidebar',
    name: 'Sidebar.tsx',
    sublabel: 'Navigation',
    x: 20,
    y: 32,
    detail: 'Navigation sidebar. Renders page links and uses NavItem.tsx.',
    connectedTo: ['app', 'navitem'],
  },
  {
    id: 'userprofile',
    name: 'UserProfile.tsx',
    sublabel: 'Profile card',
    x: 80,
    y: 32,
    detail: 'User profile widget. Calls apiClient.ts for user data and uses types from auth.ts.',
    connectedTo: ['app', 'apiclient', 'auth'],
  },
  {
    id: 'apiclient',
    name: 'apiClient.ts',
    sublabel: 'API client',
    x: 74,
    y: 74,
    detail: 'Handles network requests and error handling. Used by App.tsx and UserProfile.tsx.',
    connectedTo: ['app', 'userprofile', 'auth'],
  },
  {
    id: 'auth',
    name: 'auth.ts',
    sublabel: 'Auth helpers',
    x: 44,
    y: 78,
    detail: 'Manages authentication tokens, session headers, and auth type definitions.',
    connectedTo: ['userprofile', 'apiclient'],
  },
  {
    id: 'navitem',
    name: 'NavItem.tsx',
    sublabel: 'Link item',
    x: 18,
    y: 74,
    detail: 'Reusable navigation link item used by Sidebar.tsx.',
    connectedTo: ['sidebar'],
  },
];

export const PreBaseVisual: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('app');

  const selectedNode =
    PREBASE_NODES.find((node) => node.id === selectedId) || PREBASE_NODES[0];

  // Helper to check if an edge connects to the selected node
  const isEdgeConnected = (sourceId: string, targetId: string) => {
    return selectedId === sourceId || selectedId === targetId;
  };

  return (
    <div
      className="project-visual-card prebase-visual"
      role="region"
      aria-label="PreBase code map demo"
    >
      <div className="visual-top-bar">
        <div className="visual-title-group">
          <span className="visual-tag">PreBase demo</span>
          <span className="visual-subtag">Interactive code map</span>
        </div>
        <span className="visual-hint">Click a file to see its connections</span>
      </div>

      {/* Interactive Node Graph Canvas */}
      <div className="prebase-graph-container" aria-label="Interactive file map">
        {/* SVG connection lines layer */}
        <svg
          className="prebase-graph-svg"
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {PREBASE_NODES.flatMap((source) =>
            source.connectedTo.map((targetId) => {
              const target = PREBASE_NODES.find((n) => n.id === targetId);
              if (!target) return null;
              // Avoid duplicate reverse lines
              if (source.id > target.id && target.connectedTo.includes(source.id)) {
                return null;
              }

              const highlighted = isEdgeConnected(source.id, targetId);

              return (
                <line
                  key={`${source.id}-${target.id}`}
                  x1={`${source.x}%`}
                  y1={`${source.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  className={`prebase-edge ${highlighted ? 'prebase-edge-highlight' : ''}`}
                />
              );
            })
          )}
        </svg>

        {/* Real DOM Buttons for Interactive Nodes */}
        <div className="prebase-nodes-layer">
          {PREBASE_NODES.map((node) => {
            const isSelected = selectedId === node.id;
            const isConnected =
              selectedNode.connectedTo.includes(node.id) ||
              node.connectedTo.includes(selectedId);

            return (
              <button
                key={node.id}
                type="button"
                className={`prebase-node-btn ${isSelected ? 'is-selected' : ''} ${
                  isConnected && !isSelected ? 'is-connected' : ''
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                onClick={() => setSelectedId(node.id)}
                aria-pressed={isSelected}
                aria-label={`${node.name} (${node.sublabel})`}
              >
                <span className="node-btn-name">{node.name}</span>
                <span className="node-btn-sublabel">{node.sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contextual Detail Panel */}
      <div className="prebase-node-context" aria-live="polite">
        <div className="context-header">
          <span className="context-name">{selectedNode.name}</span>
          <span className="context-sublabel">{selectedNode.sublabel}</span>
        </div>
        <p className="context-detail">{selectedNode.detail}</p>
        <div className="context-links">
          <span className="context-links-label">Connected files:</span>
          {selectedNode.connectedTo.map((targetId) => {
            const target = PREBASE_NODES.find((n) => n.id === targetId);
            if (!target) return null;
            return (
              <button
                key={target.id}
                type="button"
                className="context-link-chip"
                aria-label={`Select ${target.name}`}
                onClick={() => setSelectedId(target.id)}
              >
                {target.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
