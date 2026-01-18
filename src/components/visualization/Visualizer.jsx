import React, { useState } from 'react';

export default function Visualizer({ steps = [] }) {
  const [current, setCurrent] = useState(0);

  if (!steps.length) return null;

  const currentStepData = steps[current];
  const isImage = !!currentStepData.image;

  return (
    <section className="section-card" id="visualization">
      <div className="section-header">
        <h2 className="section-title">Step-by-Step Visualization</h2>
      </div>

      <div className="visual-diagram" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        {isImage ? (
          <img 
            src={currentStepData.image} 
            alt={`Step ${current + 1}`} 
            style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain',borderRadius:'8px' }} 
          />
        ) : (
          <svg width="100%" height="400" viewBox="0 0 800 400">
             <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
              </marker>
            </defs>
            
            <g dangerouslySetInnerHTML={{ __html: currentStepData.svg }} />
            
          </svg>
        )}
      </div>

      {/* Controls and Steps list remain the same... */}
       <div className="visualization-controls">
        <div className="step-indicator">
          <strong>Step {current + 1}</strong> of {steps.length}
        </div>
        <div className="control-buttons">
          <button 
            className="btn-control" 
            onClick={() => setCurrent(c => c - 1)} 
            disabled={current === 0}
          >
            Back
          </button>
          <button 
            className="btn-control" 
            onClick={() => setCurrent(c => c + 1)} 
            disabled={current === steps.length - 1}
          >
            Next
          </button>
        </div>
      </div>

      <div className="algorithm-steps">
        {steps.map((s, i) => (
          <div 
            key={i} 
            className={`step-item ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)} // Added: click a step to jump to it
            style={{ cursor: 'pointer' }}
          >
            <div className="step-number">{i + 1}</div>
            <div className="step-text">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}