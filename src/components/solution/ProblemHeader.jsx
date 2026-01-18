import React from 'react';

const ProblemHeader = ({ data }) => {
  return (
    <section className="problem-header-section">
      <div className="problem-meta">
        <span className="problem-number">Problem {data.id}</span>
        <div className={`difficulty-badge difficulty-${data.difficulty.toLowerCase()}`}>
          {data.difficulty}
        </div>
        <div className="problem-tags">
          {data.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
      <h1 className="problem-title">{data.title}</h1>
      <p className="problem-description">{data.description}</p>
    </section>
  );
};

export default ProblemHeader; // <--- MUST HAVE THIS