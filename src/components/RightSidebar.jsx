import React from 'react';
import StreakCard from './StreakCard';
import ActivityCalendar from './ActivityCalendar';

const RightSidebar = ({ refreshTrigger }) => {
  return (
    <aside className="right-sidebar">
      <StreakCard refreshTrigger={refreshTrigger}/>
      <ActivityCalendar refreshTrigger={refreshTrigger} />
    </aside>
  );
};

export default RightSidebar;