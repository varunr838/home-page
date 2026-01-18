import React from 'react';

// 1. Intuition Section (Ordered List with custom counters)
export const Intuition = ({ steps = [] }) => (
  <section className="section-card" id="intuition">
    <div className="section-header">
      <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      </svg>
      <h2 className="section-title">Intuition</h2>
    </div>
    <div className="section-content">
      <ol className="intuition-steps">
        {steps.map((step, i) => (
          <li key={i}>
            <strong>{step.title}</strong>
            {step.text}
          </li>
        ))}
      </ol>
    </div>
  </section>
);

// 2. Time & Space Complexity (Grid layout with O(n) values)
export const Complexity = ({ data }) => (
  <section className="section-card" id="complexity">
    <div className="section-header">
      <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
      </svg>
      <h2 className="section-title">Time & Space Complexity</h2>
    </div>
    <div className="section-content">
      <div className="complexity-grid">
        <div className="complexity-item">
          <div className="complexity-label">Time Complexity</div>
          <div className="complexity-value">{data?.time?.value || 'O(1)'}</div>
          <div className="complexity-explanation">{data?.time?.explanation}</div>
        </div>
        <div className="complexity-item">
          <div className="complexity-label">Space Complexity</div>
          <div className="complexity-value">{data?.space?.value || 'O(1)'}</div>
          <div className="complexity-explanation">{data?.space?.explanation}</div>
        </div>
      </div>
    </div>
  </section>
);

// 3. Interview Tips (Bordered list items)
export const InterviewTips = ({ tips = [] }) => (
  <section className="section-card" id="tips">
    <div className="section-header">
      <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>
      <h2 className="section-title">Interview Tips</h2>
    </div>
    <div className="section-content">
      <ul className="tips-list">
        {tips.map((tip, i) => (
          <li key={i}>
            <strong>{tip.title}</strong>
            {tip.text}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

// 4. Common Mistakes (Warning icon cards)
export const Mistakes = ({ mistakes = [] }) => (
  <section className="section-card" id="mistakes">
    <div className="section-header">
      <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      <h2 className="section-title">Common Mistakes & Misconceptions</h2>
    </div>
    <div className="section-content">
      <div className="mistakes-list">
        {mistakes.map((m, i) => (
          <div key={i} className="mistake-item">
            <div className="mistake-icon">⚠️</div>
            <div className="mistake-content">
              <strong>{m.title}</strong>
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 5. Related Problems (Grid of cards)
export const RelatedProblems = ({ problems = [] }) => (
  <section className="section-card" id="related">
    <div className="section-header">
      <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
      </svg>
      <h2 className="section-title">Related Problems</h2>
    </div>
    <div className="section-content">
      <div className="related-problems-grid">
        {problems.map((p, i) => (
          <a key={i} href={`/problem/${p.id}`} className="related-problem-card">
            <div className="related-problem-header">
              <div className="related-problem-number">Problem {p.id}</div>
              <div className={`difficulty-badge difficulty-${p.difficulty?.toLowerCase()}`}>
                {p.difficulty}
              </div>
            </div>
            <div className="related-problem-title">{p.title}</div>
            <div className="related-problem-tags">
              {p.tags?.map(tag => (
                <span key={tag} className="tag-small">{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);