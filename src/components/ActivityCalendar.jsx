import React, { useState, useEffect } from 'react';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 
               'July', 'August', 'September', 'October', 'November', 'December'];

const ActivityCalendar = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // January
  const [activityData, setActivityData] = useState({});

  // Generate random data on mount (simulating the script behavior)
  useEffect(() => {
    const data = {};
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(2025, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const key = `2025-${month}-${day}`;
        // Random activity level 0-4
        data[key] = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
      }
    }
    setActivityData(data);
  }, []);

  const changeMonth = (direction) => {
    let newIndex = currentMonthIndex + direction;
    if (newIndex < 0) newIndex = 11;
    if (newIndex > 11) newIndex = 0;
    setCurrentMonthIndex(newIndex);
  };

  const renderCalendarGrid = () => {
    const year = 2025;
    const firstDay = new Date(year, currentMonthIndex, 1).getDay();
    const daysInMonth = new Date(year, currentMonthIndex + 1, 0).getDate();
    
    const gridElements = [];

    // Empty cells for days before start of month
    for (let i = 0; i < firstDay; i++) {
      gridElements.push(<div key={`empty-start-${i}`} className="calendar-day empty"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${currentMonthIndex}-${day}`;
      const activity = activityData[key] || 0;
      let className = "calendar-day";
      if (activity > 0) className += ` active-${activity}`;
      
      gridElements.push(
        <div key={day} className={className}>
          {day}
        </div>
      );
    }

    // Fill remaining cells
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 35 - totalCells; // 5 rows * 7 cols
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
          <span className="current-month">{months[currentMonthIndex]} 2025</span>
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
            {[1, 2, 3, 4, 5].map(week => (
              <span key={week} className="week-label">Week {week}</span>
            ))}
          </div>
          <div className="calendar-grid">
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