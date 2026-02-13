import React, { useState, useEffect } from 'react';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

const ActivityCalendar = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); 
  const [currentYear, setCurrentYear] = useState(2026);
  const [activityData, setActivityData] = useState({});
  const [loading, setLoading] = useState(false);

  // Helper: Format date as YYYY-MM-DD (e.g., 2026-01-05)
  const formatDateString = (year, monthIndex, day) => {
    const m = String(monthIndex + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Fetch data whenever month or year changes
  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) throw new Error("No authentication token found.");

        // Calculate start and end of the selected month
        const startDate = formatDateString(currentYear, currentMonthIndex, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
        const endDate = formatDateString(currentYear, currentMonthIndex, lastDayOfMonth);

        const response = await fetch(
          `https://dorie-lunulate-breezily.ngrok-free.dev/activity/daily?start=${startDate}&end=${endDate}`, 
          {
            method:'GET',
            credentials:'include',
            headers: {
              'ngrok-skip-browser-warning': 'true',
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Transform array [{ date: "2026-01-10", count: 3 }] 
          // into object { "2026-01-10": 3 } for O(1) lookup
          const dataMap = {};
          data.forEach(item => {
            dataMap[item.date] = item.count;
          });
          setActivityData(dataMap);
        }
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [currentMonthIndex, currentYear]);

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
      // Use the same helper to generate key so it matches the API data keys
      const key = formatDateString(currentYear, currentMonthIndex, day);
      const count = activityData[key] || 0;
      
      // Determine color intensity based on count
      // 0 = none, 1-2 = low, 3-4 = medium, 5+ = high (adjust thresholds as needed)
      let activeClass = "";
      if (count >= 1) activeClass = "active-1";
      if (count >= 3) activeClass = "active-2";
      if (count >= 5) activeClass = "active-3";
      if (count >= 7) activeClass = "active-4";

      gridElements.push(
        <div key={day} className={`calendar-day ${activeClass}`} title={`${count} submissions`}>
          {day}
        </div>
      );
    }

    // Fill remaining cells for visual consistency (5 rows * 7 cols = 35 cells minimum)
    // This logic ensures at least the grid is square-ish.
    const totalCells = firstDay + daysInMonth;
    const remainingCells = (totalCells > 35 ? 42 : 35) - totalCells; 
    
    if (remainingCells > 0) {
      for (let i = 0; i < remainingCells; i++) {
        gridElements.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
      }
    }

    return gridElements;
  };

  return (
    <div className="card-base calendar-card">
      <div className="calendar-header">
        <span className="streak-title">Activity Calendar</span>
        <div className="month-selector">
          <button className="month-btn" onClick={() => changeMonth(-1)}>◀</button>
          <span className="current-month">{months[currentMonthIndex]} {currentYear}</span>
          <button className="month-btn" onClick={() => changeMonth(1)}>▶</button>
        </div>
      </div>
      <div className="calendar-container">
        <div className="calendar-labels">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day-label">{day}</div>
          ))}
        </div>
        <div className="calendar-content">
          <div className="week-labels">
             {/* Simple week labels, visually hidden or simplified if needed */}
            <span className="week-label">Week 1</span>
            <span className="week-label">Week 2</span>
            <span className="week-label">Week 3</span>
            <span className="week-label">Week 4</span>
            <span className="week-label">Week 5</span>
          </div>
          <div className={`calendar-grid ${loading ? 'opacity-50' : ''}`}>
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