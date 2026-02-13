import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const verifySession = async () => {
            // 1. Check local storage first
            if (localStorage.getItem('isLoggedIn') === 'true') {
                setStatus('authorized');
                return;
            }

            // 2. If not in local storage, try to ping the backend.
            // We use a small timeout to ensure the browser has processed the redirect cookies.
            try {
                const response = await fetch("https://dorie-lunulate-breezily.ngrok-free.dev/user/get-progress", {
                    method: 'GET',
                    credentials: 'include', // CRITICAL for cross-origin cookies
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    localStorage.setItem('isLoggedIn', 'true');
                    setStatus('authorized');
                } else {
                    setStatus('unauthorized');
                }
            } catch (err) {
                console.error("Auth check failed", err);
                setStatus('unauthorized');
            }
        };

        verifySession();
    }, []);

    if (status === 'loading') {
        // Show a blank screen or a simple spinner while checking the backend
        return <div style={{ backgroundColor: '#0a0e27', height: '100vh' }}></div>;
    }

    if (status === 'unauthorized') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;