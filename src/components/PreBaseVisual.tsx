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

const PREBASE_NODES: PreBaseNode[] = [
  {
    id: 'workbench',
    name: 'Workbench',
    sublabel: 'Code-OSS Host',
    x: 50,
    y: 32,
    detail: 'The main editor window, forked from Code-OSS to run extensions and handle files.',
    connectedTo: ['graph', 'runtime', 'agents'],
  },
  {
    id: 'graph',
    name: 'Architecture Map',
    sublabel: 'Code Map',
    x: 22,
    y: 24,
    detail: 'Shows files, imports, and dependencies as an interactive map instead of just a folder tree.',
    connectedTo: ['workbench', 'parser', 'temporal'],
  },
  {
    id: 'runtime',
    name: 'Runtime Preview',
    sublabel: 'Browser View',
    x: 78,
    y: 24,
    detail: 'Runs a local preview right beside the code you are editing.',
    connectedTo: ['workbench'],
  },
  {
    id: 'agents',
    name: 'Agents',
    sublabel: 'Workspace',
    x: 80,
    y: 74,
    detail: 'An assistant integrated into the editor that reads the code map to understand how files connect.',
    connectedTo: ['workbench'],
  },
  {
    id: 'parser',
    name: 'AST Parser',
    sublabel: 'Syntax',
    x: 18,
    y: 74,
    detail: 'Reads source files to find imports, exports, and function calls.',
    connectedTo: ['graph'],
  },
  {
    id: 'temporal',
    name: 'Temporal Index',
    sublabel: 'Git History',
    x: 48,
    y: 78,
    detail: 'Tracks how files and connections changed over time across git commits.',
    connectedTo: ['graph'],
  },
];

export const PreBaseVisual: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('graph');

  const selectedNode =
    PREBASE_NODES.find((node) => node.id === selectedId) || PREBASE_NODES[1];

  // Helper to check if an edge connects to the selected node
  const isEdgeConnected = (sourceId: string, targetId: string) => {
    return selectedId === sourceId || selectedId === targetId;
  };

  return (
    <div className="project-visual-card prebase-visual" role="region" aria-label="PreBase Interactive Architecture Canvas">
      <div className="visual-top-bar">
        <div className="visual-title-group">
          <span className="visual-tag">PreBase Demo</span>
          <span className="visual-subtag">Code-OSS + Code Map</span>
        </div>
        <span className="visual-hint">Click a module to see its connections</span>
      </div>

      {/* Interactive Node Graph Canvas */}
      <div className="prebase-graph-container" aria-label="Interactive module map">
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
            const isConnected = selectedNode.connectedTo.includes(node.id) || node.connectedTo.includes(selectedId);

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
          <span className="context-links-label">Connected to:</span>
          {selectedNode.connectedTo.map((targetId) => {
            const target = PREBASE_NODES.find((n) => n.id === targetId);
            if (!target) return null;
            return (
              <button
                key={target.id}
                type="button"
                className="context-link-chip"
                aria-label={`Inspect ${target.name}`}
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

