import React, { useState } from 'react';
import './ProjectVisuals.css';

export interface DemoPrompt {
  id: 'water' | 'checklist' | 'expense';
  text: string;
  toolTitle: string;
  agentSteps: string[];
}

export const DEMO_PROMPTS: DemoPrompt[] = [
  {
    id: 'water',
    text: 'Build me a water tracker.',
    toolTitle: 'Water Tracker',
    agentSteps: [
      'Understanding request: daily hydration goal',
      'Configuring counter & progress components',
      'Persisting schema in local SQLite',
    ],
  },
  {
    id: 'checklist',
    text: 'Make me a checklist for my week.',
    toolTitle: 'Weekly Checklist',
    agentSteps: [
      'Structuring task list schema',
      'Generating toggleable task items',
      'Saving active tasks to local SQLite',
    ],
  },
  {
    id: 'expense',
    text: 'Create an expense splitter for four people.',
    toolTitle: 'Expense Splitter',
    agentSteps: [
      'Setting bill & member division logic',
      'Binding interactive rate adjusters',
      'Synthesizing declarative tool',
    ],
  },
];

type FlowPhase = 'idle' | 'submitting' | 'working' | 'ready';

export const CoresideVisual: React.FC = () => {
  // Randomly select ONE of the 3 prompts on initial mount
  const [prompt, setPrompt] = useState<DemoPrompt>(() => {
    const randomIndex = Math.floor(Math.random() * DEMO_PROMPTS.length);
    return DEMO_PROMPTS[randomIndex];
  });

  const [phase, setPhase] = useState<FlowPhase>('idle');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Tool 1: Water Tracker State
  const [waterGlasses, setWaterGlasses] = useState(3);

  // Tool 2: Checklist State
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: 'Review biology lecture notes', done: true },
    { id: 2, text: 'Verify PreBase graph parser', done: true },
    { id: 3, text: 'U.S. Wushu team training routine', done: false },
    { id: 4, text: 'Test Coreside Tauri 2 SQLite sync', done: false },
  ]);

  // Tool 3: Expense Splitter State
  const [billAmount, setBillAmount] = useState(120);
  const [peopleCount, setPeopleCount] = useState(4);


  // Handle clicking the prompt to begin synthesis
  const handleExecutePrompt = () => {
    if (phase !== 'idle') return;

    const isReduced =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);

    if (isReduced) {
      setPhase('ready');
      return;
    }

    setPhase('submitting');

    // Phase 1 -> Phase 2 transition (~200ms)
    setTimeout(() => {
      setPhase('working');
      setActiveStepIndex(0);

      // Stagger agent steps (~400ms each)
      setTimeout(() => setActiveStepIndex(1), 350);
      setTimeout(() => setActiveStepIndex(2), 700);

      // Phase 2 -> Phase 3 transition (~1050ms total)
      setTimeout(() => {
        setPhase('ready');
      }, 1050);
    }, 200);
  };

  // Replay: pick a DIFFERENT prompt and reset
  const handleReplay = () => {
    const remaining = DEMO_PROMPTS.filter((p) => p.id !== prompt.id);
    const nextPrompt = remaining[Math.floor(Math.random() * remaining.length)] || DEMO_PROMPTS[0];

    // Reset tool states to pristine defaults
    setWaterGlasses(3);
    setChecklistItems([
      { id: 1, text: 'Review biology lecture notes', done: true },
      { id: 2, text: 'Verify PreBase graph parser', done: true },
      { id: 3, text: 'U.S. Wushu team training routine', done: false },
      { id: 4, text: 'Test Coreside Tauri 2 SQLite sync', done: false },
    ]);
    setBillAmount(120);
    setPeopleCount(4);
    setActiveStepIndex(0);

    setPrompt(nextPrompt);
    setPhase('idle');
  };

  // Checklist helper
  const toggleChecklistItem = (id: number) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedTasksCount = checklistItems.filter((item) => item.done).length;

  return (
    <div
      className="project-visual-card coreside-visual"
      role="region"
      aria-label="Coreside Prompt to Tool Demo"
    >
      <div className="visual-top-bar">
        <div className="visual-title-group">
          <span className="visual-tag">Coreside Environment</span>
          <span className="visual-subtag">Prompt → Declarative Tool</span>
        </div>
        {phase === 'ready' ? (
          <button
            type="button"
            className="replay-btn"
            onClick={handleReplay}
            aria-label="Try another prompt"
          >
            Try another prompt ↺
          </button>
        ) : (
          <span className="visual-hint">Click the prompt to synthesize</span>
        )}
      </div>

      <div className="coreside-canvas-body">
        {/* Step 1: Prompt Card (always visible, styled based on phase) */}
        <div
          className={`coreside-prompt-card ${phase === 'idle' ? 'is-clickable' : ''} ${
            phase === 'submitting' ? 'is-submitting' : ''
          } ${phase === 'working' || phase === 'ready' ? 'is-sent' : ''}`}
          onClick={phase === 'idle' ? handleExecutePrompt : undefined}
          onKeyDown={(e) => {
            if (phase === 'idle' && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleExecutePrompt();
            }
          }}
          tabIndex={phase === 'idle' ? 0 : -1}
          role={phase === 'idle' ? 'button' : undefined}
          aria-label={phase === 'idle' ? `Run prompt: ${prompt.text}` : undefined}
        >
          <div className="prompt-header">
            <span className="prompt-user-badge">User Prompt</span>
            {phase === 'idle' && (
              <span className="prompt-cta-hint">Click to build tool →</span>
            )}
          </div>
          <p className="prompt-quote">“{prompt.text}”</p>
        </div>

        {/* Step 2: Agent Working Log */}
        {(phase === 'working' || phase === 'ready') && (
          <div
            className={`coreside-agent-tray ${phase === 'ready' ? 'tray-condensed' : ''}`}
            aria-live="polite"
          >
            {phase === 'working' ? (
              <div className="agent-steps-list">
                <span className="agent-tray-label">Coreside Agent</span>
                {prompt.agentSteps.map((step, idx) => (
                  <div
                    key={step}
                    className={`agent-step-item ${idx <= activeStepIndex ? 'is-active' : 'is-pending'}`}
                  >
                    <span className="step-indicator">
                      {idx < activeStepIndex ? '✓' : idx === activeStepIndex ? '›' : '·'}
                    </span>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="agent-success-badge">
                <span className="agent-success-icon">✓</span>
                <span className="agent-success-text">
                  Generated {prompt.toolTitle} · Saved to SQLite
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Generated Working Tool (Rendered ONLY in 'ready' phase) */}
        {phase === 'ready' && (
          <div
            className="coreside-generated-tool animate-tool-enter"
            aria-label={`Generated ${prompt.toolTitle}`}
          >
            <div className="tool-masthead">
              <div className="tool-title-wrap">
                <span className="tool-icon">
                  {prompt.id === 'water' ? '💧' : prompt.id === 'checklist' ? '☑' : '💳'}
                </span>
                <span className="tool-title">{prompt.toolTitle}</span>
              </div>
              <span className="tool-state-pill">Live Local Tool</span>
            </div>

            {/* Tool 1: Water Tracker */}
            {prompt.id === 'water' && (
              <div className="tool-interface-water">
                <div className="water-stats-row">
                  <span className="water-label">Glasses today</span>
                  <div className="water-counter-controls">
                    <button
                      type="button"
                      className="counter-btn"
                      onClick={() => setWaterGlasses((g) => Math.max(0, g - 1))}
                      aria-label="Decrease glasses"
                    >
                      −
                    </button>
                    <span className="counter-val">{waterGlasses}</span>
                    <button
                      type="button"
                      className="counter-btn"
                      onClick={() => setWaterGlasses((g) => g + 1)}
                      aria-label="Increase glasses"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="water-progress-track" aria-hidden="true">
                  <div
                    className="water-progress-fill"
                    style={{
                      width: `${Math.min(100, Math.round((waterGlasses / 8) * 100))}%`,
                    }}
                  />
                </div>

                <div className="water-footer">
                  <span className="water-goal-text">
                    Goal: 8 glasses ({Math.round((waterGlasses / 8) * 100)}%)
                  </span>
                  <button
                    type="button"
                    className="tool-reset-btn"
                    onClick={() => setWaterGlasses(0)}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Tool 2: Weekly Checklist */}
            {prompt.id === 'checklist' && (
              <div className="tool-interface-checklist">
                <div className="checklist-progress-bar">
                  <span className="checklist-count-label">
                    {completedTasksCount} of {checklistItems.length} completed
                  </span>
                </div>

                <ul className="checklist-items-list">
                  {checklistItems.map((item) => (
                    <li key={item.id} className="checklist-item">
                      <label className="checklist-label">
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleChecklistItem(item.id)}
                          className="checklist-checkbox"
                        />
                        <span className={`checklist-item-text ${item.done ? 'is-done' : ''}`}>
                          {item.text}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tool 3: Expense Splitter */}
            {prompt.id === 'expense' && (
              <div className="tool-interface-expense">
                <div className="expense-inputs-row">
                  <div className="expense-field">
                    <span className="expense-field-label">Total Bill</span>
                    <div className="expense-amount-control">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setBillAmount((b) => Math.max(10, b - 20))}
                        aria-label="Decrease bill by 20"
                      >
                        −
                      </button>
                      <span className="expense-amount-val">${billAmount}</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setBillAmount((b) => b + 20)}
                        aria-label="Increase bill by 20"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="expense-field">
                    <span className="expense-field-label">People</span>
                    <div className="expense-people-control">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                        aria-label="Decrease people count"
                      >
                        −
                      </button>
                      <span className="expense-people-val">{peopleCount}</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setPeopleCount((p) => p + 1)}
                        aria-label="Increase people count"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="expense-result-box">
                  <span className="expense-result-label">Cost per person</span>
                  <span className="expense-result-number">
                    ${(billAmount / Math.max(1, peopleCount)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="visual-status-bar">
        <span className="status-kind">Tauri 2 · Rust Core</span>
        <span className="status-name">
          {phase === 'ready'
            ? 'Interactive tool active in local state'
            : 'Declarative tool synthesis pipeline'}
        </span>
      </div>
    </div>
  );
};
