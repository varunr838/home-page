import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const ProgressSection = ({ refreshTrigger }) => {
  const [stats, setStats] = useState({
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalSolved: 0
  });
  const [loading, setLoading] = useState(true);

  const TOTAL_GOAL = 100;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') return;

        const response = await apiFetch("/user/get-progress");

        if (response.ok) {
          const data = await response.json();
          setStats({
            easySolved: data.easySolved || 0,
            mediumSolved: data.mediumSolved || 0,
            hardSolved: data.hardSolved || 0,
            totalSolved: data.totalSolved || 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch progress stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [refreshTrigger]);

  // Calculate percentage for the progress bar width (capped at 100%)
  const progressPercentage = Math.min(
    (stats.totalSolved / TOTAL_GOAL) * 100, 
    100
  );

  return (
    <div className="card-base progress-section">
      <div className="progress-header">
        <h2 className="progress-title">Your Progress</h2>
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-label">Solved:</span>
            <span className="stat-value">
              {loading ? "..." : `${stats.totalSolved}/${TOTAL_GOAL}`}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Easy:</span>
            <span className="stat-value">
              {loading ? "..." : stats.easySolved}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Medium:</span>
            <span className="stat-value">
              {loading ? "..." : stats.mediumSolved}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Hard:</span>
            <span className="stat-value">
              {loading ? "..." : stats.hardSolved}
            </span>
          </div>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${loading ? 0 : progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressSection;