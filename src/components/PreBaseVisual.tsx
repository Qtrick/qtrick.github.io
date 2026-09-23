import React, { useState } from 'react';
import './ProjectVisuals.css';

interface NodeInfo {
  id: string;
  name: string;
  kind: string;
  x: number;
  y: number;
  connections: string[];
}

const NODES: NodeInfo[] = [
  { id: 'workbench', name: 'Code-OSS Host', kind: 'Host', x: 260, y: 130, connections: ['graph', 'runtime', 'agent'] },
  { id: 'graph', name: 'Graph Subsystem', kind: 'Mapping', x: 110, y: 70, connections: ['parser', 'temporal'] },
  { id: 'parser', name: 'AST Parser', kind: 'Analysis', x: 50, y: 190, connections: [] },
  { id: 'temporal', name: 'Temporal Index', kind: 'History', x: 155, y: 215, connections: [] },
  { id: 'runtime', name: 'Runtime Preview', kind: 'Preview', x: 410, y: 70, connections: ['devserver'] },
  { id: 'devserver', name: 'Vite DevServer', kind: 'Network', x: 470, y: 190, connections: [] },
  { id: 'agent', name: 'Agent Context', kind: 'AI', x: 360, y: 215, connections: [] },
];

export const PreBaseVisual: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('graph');

  const selected = NODES.find((n) => n.id === activeNode) || NODES[1];

  return (
    <div className="project-visual-card prebase-visual">
      <div className="visual-top-bar">
        <span className="visual-tag">Codebase Map</span>
        <span className="visual-hint">Click a module to inspect connections</span>
      </div>

      <div className="graph-canvas-wrapper">
        <svg
          viewBox="0 0 520 270"
          className="graph-svg"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Interactive architecture graph for PreBase"
        >
          {/* Edges */}
          <g className="graph-edges">
            {NODES.map((node) =>
              node.connections.map((targetId) => {
                const target = NODES.find((n) => n.id === targetId);
                if (!target) return null;
                const isHighlighted =
                  activeNode === node.id || activeNode === target.id;
                return (
                  <line
                    key={`${node.id}-${target.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    className={`graph-edge ${isHighlighted ? 'edge-highlight' : ''}`}
                  />
                );
              })
            )}
          </g>

          {/* Nodes */}
          <g className="graph-nodes">
            {NODES.map((node) => {
              const isSelected = activeNode === node.id;
              return (
                <g
                  key={node.id}
                  className={`graph-node ${isSelected ? 'node-selected' : ''}`}
                  onClick={() => setActiveNode(node.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${node.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveNode(node.id);
                    }
                  }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 18 : 14}
                    className="node-circle"
                  />
                  <text
                    x={node.x}
                    y={node.y > 100 ? node.y + 26 : node.y - 20}
                    textAnchor="middle"
                    className="node-label"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="visual-status-bar">
        <span className="status-kind">{selected.kind} Module</span>
        <span className="status-name">{selected.name}</span>
      </div>
    </div>
  );
};
