import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="card-base">
        <input type="text" className="search-bar" placeholder="🔍 Search problems..." />
        
        <div className="filters">
          <div className="filter-group">
            <span className="filter-label">Difficulty</span>
            <div className="filter-buttons">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Easy</button>
              <button className="filter-btn">Medium</button>
              <button className="filter-btn">Hard</button>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Topics</span>
            <div className="filter-buttons">
              {['Arrays', 'Strings', 'Trees', 'Linked Lists', 'Dynamic Programming', 'Graphs', 'Stack & Queue', 'Sorting'].map(topic => (
                <button key={topic} className="filter-btn">{topic}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;