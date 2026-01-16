import React from 'react';

const ProgressSection = () => {
  return (
    <div className="card-base progress-section">
      <div className="progress-header">
        <h2 className="progress-title">Your Progress</h2>
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-label">Solved:</span>
            <span className="stat-value">45/100</span>
          </div>
          <div className="stat">
            <span className="stat-label">Easy:</span>
            <span className="stat-value">25</span>
          </div>
          <div className="stat">
            <span className="stat-label">Medium:</span>
            <span className="stat-value">15</span>
          </div>
          <div className="stat">
            <span className="stat-label">Hard:</span>
            <span className="stat-value">5</span>
          </div>
        </div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

export default ProgressSection;