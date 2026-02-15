import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    
    // --- State for Interactive Chart ---
    // In a real app, 'defaultStats' would come from an API fetch
    const defaultStats = { solved: 487, total: 3837, label: 'Solved', color: '#ffa116', gradientId: 'gradient' };
    const [activeStats, setActiveStats] = useState(defaultStats);

    const statsData = {
        easy: { solved: 245, total: 925, label: 'Easy', color: '#ffa116', gradientId: 'easyGradient' },
        medium: { solved: 187, total: 2005, label: 'Medium', color: '#ff9500', gradientId: 'mediumGradient' },
        hard: { solved: 55, total: 907, label: 'Hard', color: '#ef4743', gradientId: 'hardGradient' }
    };

    // --- Circular Progress Logic ---
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - ((activeStats.solved / activeStats.total) * 100 / 100) * circumference;

    // --- Heatmap Data Generation (Mocking 364 days) ---
    const heatmapCells = useMemo(() => {
        return Array.from({ length: 364 }, (_, i) => {
            const random = Math.random();
            let level = 0;
            if (random > 0.85) level = 4;
            else if (random > 0.7) level = 3;
            else if (random > 0.5) level = 2;
            else if (random > 0.3) level = 1;
            return { level, id: i };
        });
    }, []);

    return (
        <div className="profile-wrapper">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <div className="logo">CodeLeat</div>
                    <nav>
                        <ul className="nav-links">
                            <li><a href="#" className="active">Profile</a></li>
                            <li><a href="#">Problems</a></li>
                            <li><a href="#">Contest</a></li>
                            <li><a href="#">Discuss</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="container">
                {/* Profile Info Header */}
                <div className="profile-header">
                    <div className="profile-top">
                        <div className="avatar">JD</div>
                        <div className="profile-info">
                            <h1 className="username">John Developer</h1>
                            <div className="user-meta">
                                <div className="meta-item">
                                    <span>@</span><span>johndeveloper</span>
                                </div>
                            </div>
                            <p className="bio">
                                Full-stack developer passionate about algorithms and problem-solving. 
                                Love tackling challenging problems and learning new technologies.
                            </p>
                            <div className="profile-actions">
                                <button className="btn btn-primary" onClick={() => navigate('/profile/edit')}>Edit Profile</button>
                                <button className="btn btn-secondary">Share Profile</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="stats-layout">
                    {/* Problems Solved Column */}
                    <div className="stats-card">
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'center' }}>
                            {/* SVG Chart */}
                            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                                <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ffa116" />
                                            <stop offset="50%" stopColor="#ff9500" />
                                            <stop offset="100%" stopColor="#ef4743" />
                                        </linearGradient>
                                        <linearGradient id="easyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ffa116" />
                                            <stop offset="100%" stopColor="#ffb84d" />
                                        </linearGradient>
                                        <linearGradient id="mediumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ff9500" />
                                            <stop offset="100%" stopColor="#ffaa33" />
                                        </linearGradient>
                                        <linearGradient id="hardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ef4743" />
                                            <stop offset="100%" stopColor="#ff6b6b" />
                                        </linearGradient>
                                    </defs>
                                    
                                    <circle cx="80" cy="80" r="70" fill="none" stroke="var(--navy-light)" strokeWidth="10"/>
                                    <circle cx="80" cy="80" r="70" fill="none" 
                                        stroke={`url(#${activeStats.gradientId})`} 
                                        strokeWidth="10"
                                        strokeDasharray={circumference} 
                                        strokeDashoffset={progressOffset} 
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
                                    />
                                </svg>
                                
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', transition: 'all 0.3s ease' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '700', fontFamily: 'Space Mono', lineHeight: '1' }}>
                                        <span>{activeStats.solved}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/{activeStats.total}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                        {activeStats.label}
                                    </div>
                                </div>
                            </div>

                            {/* Difficulty Cards */}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                                {['easy', 'medium', 'hard'].map((key) => {
                                    const data = statsData[key];
                                    const borderColors = { easy: '#ffa116', medium: '#ff9500', hard: '#ef4743' };
                                    
                                    return (
                                        <div 
                                            key={key} 
                                            className="difficulty-card"
                                            style={{ borderLeft: `3px solid ${borderColors[key]}` }}
                                            onMouseEnter={() => setActiveStats({ ...data, gradientId: data.gradientId })}
                                            onMouseLeave={() => setActiveStats(defaultStats)}
                                        >
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'capitalize' }}>{key}</span>
                                            <span style={{ fontFamily: 'Space Mono', fontWeight: '600' }}>
                                                <span style={{ color: borderColors[key] }}>{data.solved}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/{data.total}</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Streak Column */}
                    <div className="stats-card">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1rem' }}>
                                <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--navy-light)" strokeWidth="8"/>
                                    {/* Mocking streak progress */}
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="url(#streakGradient)" strokeWidth="8"
                                        strokeDasharray="327" strokeDashoffset="285" strokeLinecap="round"
                                    />
                                    <defs>
                                        <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ff9500" />
                                            <stop offset="100%" stopColor="#ff6b00" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem' }}>🔥</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'Space Mono', color: 'var(--orange-primary)' }}>47</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Current Streak</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Keep it going! 🚀</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heatmap Section */}
                <div className="form-section">
                    <h2 className="section-title">Contribution Activity</h2>
                    <div className="heatmap">
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>342 submissions in the last year</h3>
                        <div className="heatmap-grid">
                            {heatmapCells.map((cell) => (
                                <div key={cell.id} className={`heatmap-cell level-${cell.level}`} title={`Activity Level: ${cell.level}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;