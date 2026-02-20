import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const StreakCard = ({ refreshTrigger }) => {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        // Using credentials: 'include' as per your cookie-based auth setup
        const response = await apiFetch("/user/get-streak");

        if (response.ok) {
          const data = await response.json();
          // Assuming the response is a simple number or { streak: 12 }
          // Adjust based on your actual backend JSON structure
          setStreak(typeof data === 'number' ? data : (data.streak || 0));
        }
      } catch (error) {
        console.error("Failed to fetch streak:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [refreshTrigger]);

  return (
    <div className="card-base streak-card">
      <div className="streak-header">
        <span className="streak-title">Current Streak</span>
        <span className="streak-icon">🔥</span>
      </div>
      <div className="streak-number">
        {loading ? "..." : streak}
      </div>
      <div className="streak-label">days in a row</div>
    </div>
  );
};

export default StreakCard;