import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

const ActivityCalendar = ({ refreshTrigger }) => {
  // 1. Initialize with the CURRENT date, not hardcoded 2026
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth()); 
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const [activityData, setActivityData] = useState({});
  const [loading, setLoading] = useState(false);

  const formatDateString = (year, monthIndex, day) => {
    const m = String(monthIndex + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) return; // Silent fail or handle as needed

        const startDate = formatDateString(currentYear, currentMonthIndex, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
        const endDate = formatDateString(currentYear, currentMonthIndex, lastDayOfMonth);

        // Using the apiFetch utility handles token refresh automatically
        const response = await apiFetch(`/activity/daily?start=${startDate}&end=${endDate}`);

        if (response && response.ok) {
          const data = await response.json();
          // Transform array to map for O(1) lookup
          const dataMap = {};
          if (Array.isArray(data)) {
            data.forEach(item => {
              // Ensure item.date matches format YYYY-MM-DD
              dataMap[item.date] = item.count;
            });
          }
          setActivityData(dataMap);
        }
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [currentMonthIndex, currentYear,refreshTrigger]);

  const changeMonth = (direction) => {
    let newIndex = currentMonthIndex + direction;
    let newYear = currentYear;

    if (newIndex < 0) {
      newIndex = 11;
      newYear -= 1;
    } else if (newIndex > 11) {
      newIndex = 0;
      newYear += 1;
    }

    setCurrentMonthIndex(newIndex);
    setCurrentYear(newYear);
  };

  const renderCalendarGrid = () => {
    const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    
    const gridElements = [];

    // Empty cells for days before start of month
    for (let i = 0; i < firstDay; i++) {
      gridElements.push(<div key={`empty-start-${i}`} className="calendar-day empty"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const key = formatDateString(currentYear, currentMonthIndex, day);
      const count = activityData[key] || 0;
      
      let activeClass = "";
      if (count >= 1) activeClass = "active-1";
      if (count >= 3) activeClass = "active-2";
      if (count >= 5) activeClass = "active-3";
      if (count >= 7) activeClass = "active-4";

      gridElements.push(
        <div key={day} className={`calendar-day ${activeClass}`} title={`${count} submissions on ${key}`}>
          {day}
        </div>
      );
    }

    // Fill remaining cells for visual consistency
    const totalCells = firstDay + daysInMonth;
    // Ensure we fill complete rows (multiples of 7)
    const remainingCells = (7 - (totalCells % 7)) % 7;
    
    for (let i = 0; i < remainingCells; i++) {
      gridElements.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
    }

    return gridElements;
  };

  return (
    <div className="card-base calendar-card">
      <div className="calendar-header">
        <span className="streak-title">Activity Calendar</span>
        <div className="month-selector">
          <button className="month-btn" onClick={() => changeMonth(-1)}>◀</button>
          <span className="current-month" style={{minWidth: '120px', textAlign: 'center'}}>
            {months[currentMonthIndex]} {currentYear}
          </span>
          <button className="month-btn" onClick={() => changeMonth(1)}>▶</button>
        </div>
      </div>

      <div className="calendar-container" style={{ flexDirection: 'column' }}>
        {/* 2. Moved Labels ABOVE the grid for proper alignment */}
        <div className="calendar-labels" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '10px', paddingTop: '0' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day-label" style={{ textAlign: 'center' }}>{day}</div>
          ))}
        </div>

        <div className="calendar-content">
          <div className={`calendar-grid ${loading ? 'opacity-50' : ''}`} style={{ width: '100%' }}>
            {renderCalendarGrid()}
          </div>
        </div>
      </div>

      <div className="calendar-legend">
        <span>Less</span>
        <div className="legend-items">
          <div className="legend-box" style={{background: 'rgba(30, 41, 59, 0.6)'}}></div>
          <div className="legend-box" style={{background: 'rgba(251, 191, 36, 0.3)'}}></div>
          <div className="legend-box" style={{background: 'rgba(251, 191, 36, 0.6)'}}></div>
          <div className="legend-box" style={{background: 'rgba(251, 191, 36, 0.9)'}}></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityCalendar;