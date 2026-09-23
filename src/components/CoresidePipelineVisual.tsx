import React, { useState } from 'react';
import './Visuals.css';

interface FlowStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  detail: string;
  badge: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: 'input',
    stepNumber: '01',
    title: 'Natural Dialogue',
    subtitle: 'Intent & Specification',
    detail: 'User requests a capability (e.g. "Create a study tracker with priority tags and local export").',
    badge: 'Prompt Layer',
  },
  {
    id: 'synthesis',
    stepNumber: '02',
    title: 'Declarative Synthesis',
    subtitle: 'JSON Schema Validation',
    detail: 'Agent generates a structured JSON tool specification targeting safe component primitives—not arbitrary executable JavaScript.',
    badge: 'Zod & Serde Gates',
  },
  {
    id: 'runtime',
    stepNumber: '03',
    title: 'Protected Local Runtime',
    subtitle: 'Rust Core & SQLite',
    detail: 'Tool renders in a restricted React component canvas. State, versions, and rollbacks persist locally via SQLite.',
    badge: 'Local-First Boundary',
  },
];

export const CoresidePipelineVisual: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(1);
  const activeStep = FLOW_STEPS[activeStepIndex];

  return (
    <div className="visual-card" aria-label="Interactive Coreside Safety Pipeline">
      <div className="visual-header">
        <div className="visual-indicator">
          <span className="visual-dot"></span>
          <span className="visual-title">Coreside Architecture Flow</span>
        </div>
        <span className="visual-status-pill">Safe GenUI Pipeline</span>
      </div>

      <div className="pipeline-steps-grid" role="tablist" aria-label="Pipeline Stages">
        {FLOW_STEPS.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={step.id}
              role="tab"
              aria-selected={isActive}
              className={`pipeline-step-tab ${isActive ? 'tab-active' : ''}`}
              onClick={() => setActiveStepIndex(idx)}
            >
              <span className="step-num">{step.stepNumber}</span>
              <span className="step-name">{step.title}</span>
            </button>
          );
        })}
      </div>

      <div className="pipeline-canvas" role="tabpanel" aria-label={activeStep.title}>
        <div className="pipeline-preview-box">
          <div className="pipeline-box-top">
            <span className="pipeline-tag">{activeStep.badge}</span>
            <span className="pipeline-code-indicator">
              {activeStep.id === 'input' && 'chat://session-prompt'}
              {activeStep.id === 'synthesis' && 'schema://tool-definition.json'}
              {activeStep.id === 'runtime' && 'tauri://rusqlite.db'}
            </span>
          </div>

          <div className="pipeline-content-area">
            {activeStep.id === 'input' && (
              <div className="pipeline-sample-chat">
                <div className="chat-bubble user-bubble">
                  "Build an interactive workout set tracker with rests and local history."
                </div>
                <div className="chat-bubble ai-bubble">
                  "Synthesizing structured tool specification with timer and persistence..."
                </div>
              </div>
            )}

            {activeStep.id === 'synthesis' && (
              <div className="pipeline-sample-code">
                <pre>
                  <code>{`{
  "type": "tool_proposal",
  "name": "WorkoutTracker",
  "components": [
    { "type": "counter", "id": "sets", "label": "Sets Completed" },
    { "type": "checklist", "id": "exercises", "storage": "sqlite" },
    { "type": "button", "action": "record_entry" }
  ],
  "sandbox": "declarative-only"
}`}</code>
                </pre>
              </div>
            )}

            {activeStep.id === 'runtime' && (
              <div className="pipeline-sample-runtime">
                <div className="runtime-ui-mock">
                  <div className="mock-header">
                    <span className="mock-title">Active Tool: Workout Tracker</span>
                    <span className="mock-vtag">v1.2 (Saved)</span>
                  </div>
                  <div className="mock-body">
                    <div className="mock-row">
                      <span>Squats (4 sets)</span>
                      <span className="mock-check">✓ Done</span>
                    </div>
                    <div className="mock-row">
                      <span>Rest Interval</span>
                      <span className="mock-val">00:45</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pipeline-explanation">
          <h4 className="pipeline-heading">{activeStep.title} — {activeStep.subtitle}</h4>
          <p className="pipeline-text">{activeStep.detail}</p>
        </div>
      </div>
    </div>
  );
};
