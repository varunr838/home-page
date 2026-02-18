import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api'; // Ensure this path is correct
import '../styles/Profile.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    
    // --- State Management ---
    const [profile, setProfile] = useState({
        firstName: '', lastName: '', username: '', bio: '', profilePhotoUrl: null
    });
    const [streak, setStreak] = useState(0);
    const [progress, setProgress] = useState({
        easySolved: 0, mediumSolved: 0, hardSolved: 0, totalSolved: 0,
        // Hardcoded totals for denominator (or fetch if API provides them)
        totalEasy: 925, totalMedium: 2005, totalHard: 907, totalQuestions: 3837
    });
    const [heatmapData, setHeatmapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredDiff, setHoveredDiff] = useState(null);

    // --- Fetch All Data on Mount ---
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1. Fetch Profile
                const profileRes = await apiFetch('/user/get-profile');
                if (profileRes.ok) setProfile(await profileRes.json());

                // 2. Fetch Streak
                const streakRes = await apiFetch('/user/get-streak');
                if (streakRes.ok) {
                    const data = await streakRes.json();
                    setStreak(typeof data === 'number' ? data : (data.streak || 0));
                }

                // 3. Fetch Progress
                const progressRes = await apiFetch('/user/get-progress');
                if (progressRes.ok) {
                    const data = await progressRes.json();
                    setProgress(prev => ({ ...prev, ...data }));
                }

                // 4. Fetch Activity (Last 365 Days)
                const endDate = new Date().toISOString().split('T')[0];
                const startDate = new Date(new Date().setDate(new Date().getDate() - 365)).toISOString().split('T')[0];
                
                const activityRes = await apiFetch(`/activity/daily?start=${startDate}&end=${endDate}`);
                if (activityRes.ok) {
                    const data = await activityRes.json();
                    // data is expected to be [{ date: '2023-01-01', count: 5 }, ...]
                    setHeatmapData(data);
                }

            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // --- Derived State for Charts ---
    const statsData = {
        easy: { solved: progress.easySolved, total: progress.totalEasy, label: 'Easy', color: '#ffa116', gradientId: 'easyGradient' },
        medium: { solved: progress.mediumSolved, total: progress.totalMedium, label: 'Medium', color: '#ff9500', gradientId: 'mediumGradient' },
        hard: { solved: progress.hardSolved, total: progress.totalHard, label: 'Hard', color: '#ef4743', gradientId: 'hardGradient' }
    };

    // Determine what to show in the main circle (default or hovered)
    const activeStats = hoveredDiff ? statsData[hoveredDiff] : { 
        solved: progress.totalSolved, 
        total: progress.totalQuestions, 
        label: 'Solved', 
        color: '#ffa116', 
        gradientId: 'gradient' 
    };

    // Circular Progress Calculation
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const progressPercent = activeStats.total > 0 ? (activeStats.solved / activeStats.total) : 0;
    const progressOffset = circumference - (progressPercent * circumference);

    // Process Heatmap Data: Map 365 days to cells
    const processedHeatmap = useMemo(() => {
        const today = new Date();
        const map = new Map(heatmapData.map(d => [d.date, d.count]));
        
        return Array.from({ length: 364 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - (363 - i)); // Order from past to present
            const dateStr = d.toISOString().split('T')[0];
            const count = map.get(dateStr) || 0;
            
            let level = 0;
            if (count >= 1) level = 1;
            if (count >= 3) level = 2;
            if (count >= 5) level = 3;
            if (count >= 7) level = 4;

            return { date: dateStr, count, level };
        });
    }, [heatmapData]);

    if (loading) return <div className="profile-wrapper" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Loading Profile...</div>;

    return (
        <div className="profile-wrapper">
            {/* Note: If you have a shared Navbar component, you can use that instead of this header */}
            <header className="header">
                <div className="header-content">
                    <div className="logo">CodeLeat</div>
                    <nav>
                        <ul className="nav-links">
                            <li><a href="#" className="active">Profile</a></li>
                            <li><a href="/">Dashboard</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-top">
                        <div className="avatar">
                            {profile.profilePhotoUrl ? 
                                <img src={profile.profilePhotoUrl} alt="Profile" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}}/> 
                                : 
                                // Initials if no photo
                                (profile.firstName?.[0] || 'U') + (profile.lastName?.[0] || '')
                            }
                        </div>
                        <div className="profile-info">
                            <h1 className="username">{profile.firstName} {profile.lastName}</h1>
                            <div className="user-meta">
                                <div className="meta-item">
                                    <span>@</span><span>{profile.username}</span>
                                </div>
                            </div>
                            <p className="bio">
                                {profile.bio || "No bio added yet."}
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
                                            onMouseEnter={() => setHoveredDiff(key)}
                                            onMouseLeave={() => setHoveredDiff(null)}
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
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="url(#streakGradient)" strokeWidth="8"
                                        strokeDasharray="327" 
                                        strokeDashoffset={327 - (Math.min(streak, 365)/365 * 327)} 
                                        strokeLinecap="round"
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
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'Space Mono', color: 'var(--orange-primary)' }}>
                                        {streak}
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Current Streak</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>days</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heatmap Section */}
                <div className="form-section">
                    <h2 className="section-title">Contribution Activity (Last Year)</h2>
                    <div className="heatmap">
                        <div className="heatmap-grid">
                            {processedHeatmap.map((cell, i) => (
                                <div 
                                    key={i} 
                                    className={`heatmap-cell level-${cell.level}`} 
                                    title={`${cell.count} submissions on ${cell.date}`} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;