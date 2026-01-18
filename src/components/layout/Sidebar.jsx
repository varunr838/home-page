import React from 'react';

const Sidebar = ({ stats }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-card">
                <h3 className="sidebar-title">Quick Navigation</h3>
                <nav className="sidebar-nav">
                    <a href="#code" className="sidebar-link">Solution Code</a>
                    <a href="#intuition" className="sidebar-link">Intuition</a>
                    <a href="#visualization" className="sidebar-link">Visualization</a>
                    <a href="#complexity" className="sidebar-link">Complexity</a>
                    <a href="#tips" className="sidebar-link">Interview Tips</a>
                    <a href="#mistakes" className="sidebar-link">Common Mistakes</a>
                </nav>
            </div>
            
            <div className="sidebar-card">
                <h3 className="sidebar-title">Problem Stats</h3>
                <div className="stats-list">
                    <div className="stat-item">
                        <span className="stat-label">Difficulty</span>
                        <span className="stat-value" style={{ 
                            color: stats.difficulty === 'Easy' ? 'var(--easy-border)' : 
                                   stats.difficulty === 'Medium' ? 'var(--medium-border)' : 'var(--hard-border)' 
                        }}>
                            {stats.difficulty}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Acceptance Rate</span>
                        <span className="stat-value">{stats.acceptance}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Submissions</span>
                        <span className="stat-value">{stats.submissions}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;