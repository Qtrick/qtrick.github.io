import React, { useState } from 'react';
import './ProjectVisuals.css';

export const CoresideVisual: React.FC = () => {
  const [sessions, setSessions] = useState(2);
  const [activeTask, setActiveTask] = useState(true);

  return (
    <div className="project-visual-card coreside-visual">
      <div className="visual-top-bar">
        <span className="visual-tag">Conversation → Persistent Tool</span>
        <span className="visual-hint">Interactive generated widget</span>
      </div>

      <div className="coreside-content-flow">
        {/* Step 1: Prompt */}
        <div className="prompt-bubble">
          <span className="prompt-role">User prompt</span>
          <p className="prompt-text">
            “Build me a study session tracker with a quick complete button.”
          </p>
        </div>

        {/* Step 2: Synthesis indicator */}
        <div className="synthesis-badge">
          <span className="synthesis-arrow">↓</span>
          <span className="synthesis-text">Synthesizes declarative schema · persists in SQLite</span>
        </div>

        {/* Step 3: Interactive Tool Widget */}
        <div className="generated-tool-card">
          <div className="tool-card-header">
            <span className="tool-card-title">Study Tracker</span>
            <span className="tool-card-status">Active · Local</span>
          </div>

          <div className="tool-card-body">
            <div className="tool-row">
              <span className="tool-label">Completed sessions</span>
              <div className="counter-controls">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setSessions((s) => Math.max(0, s - 1))}
                  aria-label="Decrease session count"
                >
                  −
                </button>
                <span className="counter-value">{sessions}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setSessions((s) => s + 1)}
                  aria-label="Increase session count"
                >
                  +
                </button>
              </div>
            </div>

            <div className="tool-row tool-check-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={activeTask}
                  onChange={(e) => setActiveTask(e.target.checked)}
                />
                <span className="check-label">
                  {activeTask ? 'Current focus: Biology lecture notes' : 'Session completed!'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="visual-status-bar">
        <span className="status-kind">Tauri 2 · Rust Core</span>
        <span className="status-name">Zero arbitrary JavaScript · Validated JSON schema</span>
      </div>
    </div>
  );
};
