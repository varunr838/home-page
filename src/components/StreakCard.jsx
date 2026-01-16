import React from 'react';

const StreakCard = () => {
  return (
    <div className="card-base streak-card">
      <div className="streak-header">
        <span className="streak-title">Current Streak</span>
        <span className="streak-icon">🔥</span>
      </div>
      <div className="streak-number">12</div>
      <div className="streak-label">days in a row</div>
    </div>
  );
};

export default StreakCard;