import React from 'react';
import StreakCard from './StreakCard';
import ActivityCalendar from './ActivityCalendar';

const RightSidebar = () => {
  return (
    <aside className="right-sidebar">
      <StreakCard />
      <ActivityCalendar />
    </aside>
  );
};

export default RightSidebar;