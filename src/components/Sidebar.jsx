import React from 'react';

const Sidebar = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedDifficulty, 
  setSelectedDifficulty,
  selectedTopics,
  setSelectedTopics 
}) => {

  const handleTopicClick = (topic) => {
    if (selectedTopics.includes(topic)) {
      // Remove topic if already selected
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      // Add topic
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const topicsList = ['Array', 'String', 'Tree', 'Linked List', 'Dynamic Programming', 'Graph', 'Stack & Queue', 'Sorting'];

  return (
    <aside className="sidebar">
      <div className="card-base">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="🔍 Search problems..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="filters">
          <div className="filter-group">
            <span className="filter-label">Difficulty</span>
            <div className="filter-buttons">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button 
                  key={diff}
                  className={`filter-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Topics</span>
            <div className="filter-buttons">
              {topicsList.map(topic => (
                <button 
                  key={topic} 
                  className={`filter-btn ${selectedTopics.includes(topic) ? 'active' : ''}`}
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;