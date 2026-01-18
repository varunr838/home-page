import React from 'react';

const Navbar = () => {
    const [isDark, setIsDark] = React.useState(
        localStorage.getItem('theme') === 'dark-mode'
    );

    const toggleTheme = () => {
        const body = document.body;
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            setIsDark(true);
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light-mode');
            setIsDark(false);
        }
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <div className="logo">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="6" fill="#3B82F6"/>
                        <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="logo-text">CodeLeat</span>
                </div>
                <nav className="main-nav">
                    <a href="/" className="nav-link">Problems</a>
                    <a href="#" className="nav-link">Visualize</a>
                    <a href="#" className="nav-link active">Learn</a>
                    <a href="#" className="nav-link">Discussions</a>
                </nav>
                <div className="header-actions">
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                        {isDark ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="5"></circle>
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                            </svg>
                        )}
                    </button>
                    <button className="profile-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;