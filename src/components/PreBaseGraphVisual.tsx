import React, { useState } from 'react';
import './Visuals.css';

interface NodeInfo {
  id: string;
  name: string;
  type: 'core' | 'graph' | 'agent' | 'runtime' | 'temporal';
  x: number;
  y: number;
  description: string;
}

const GRAPH_NODES: NodeInfo[] = [
  {
    id: 'workbench',
    name: 'Code-OSS Host',
    type: 'core',
    x: 180,
    y: 110,
    description: 'Forked VS Code 1.128 workbench hosting editors and UI extensions.',
  },
  {
    id: 'graphs',
    name: 'graphs/ Subsystem',
    type: 'graph',
    x: 80,
    y: 55,
    description: 'Strictly bounded architecture and network mapping subsystem.',
  },
  {
    id: 'magnus',
    name: 'Agents (Magnus)',
    type: 'agent',
    x: 280,
    y: 55,
    description: 'Gemini agent hooked into chat toolbar with graph awareness.',
  },
  {
    id: 'runtime',
    name: 'Runtime Preview',
    type: 'runtime',
    x: 90,
    y: 165,
    description: 'In-IDE localhost preview for dev servers with hot reload.',
  },
  {
    id: 'temporal',
    name: 'Temporal Index',
    type: 'temporal',
    x: 270,
    y: 165,
    description: 'Codebase history and spatial commit navigation graph.',
  },
];

const EDGES: [string, string][] = [
  ['workbench', 'graphs'],
  ['workbench', 'magnus'],
  ['workbench', 'runtime'],
  ['workbench', 'temporal'],
  ['graphs', 'magnus'],
  ['graphs', 'temporal'],
];

export const PreBaseGraphVisual: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeInfo>(GRAPH_NODES[0]);

  return (
    <div className="visual-card" aria-label="Interactive PreBase Architecture Graph">
      <div className="visual-header">
        <div className="visual-indicator">
          <span className="visual-dot"></span>
          <span className="visual-title">PreBase Graph Subsystem</span>
        </div>
        <span className="visual-status-pill">Interactive Map</span>
      </div>

      <div className="graph-container">
        <svg
          viewBox="0 0 360 220"
          className="graph-svg"
          aria-hidden="true"
        >
          {/* Edges */}
          <g className="graph-edges">
            {EDGES.map(([fromId, toId]) => {
              const from = GRAPH_NODES.find((n) => n.id === fromId)!;
              const to = GRAPH_NODES.find((n) => n.id === toId)!;
              const isHighlighted =
                selectedNode.id === fromId || selectedNode.id === toId;

              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={`graph-edge ${isHighlighted ? 'edge-active' : ''}`}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="graph-nodes">
            {GRAPH_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <g
                  key={node.id}
                  className={`graph-node-group ${isSelected ? 'node-selected' : ''}`}
                  onClick={() => setSelectedNode(node)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedNode(node);
                    }
                  }}
                  aria-label={`${node.name}: ${node.description}`}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 16 : 13}
                    className={`node-circle node-${node.type}`}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 20 : 16}
                    className="node-ring"
                  />
                  <text
                    x={node.x}
                    y={node.y + (node.y > 110 ? 25 : -20)}
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

      <div className="visual-footer">
        <div className="node-info-panel">
          <span className="node-info-tag">{selectedNode.name}</span>
          <p className="node-info-desc">{selectedNode.description}</p>
        </div>
      </div>
    </div>
  );
};
