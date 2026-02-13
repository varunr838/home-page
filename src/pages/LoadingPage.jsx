import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/Auth.css';

const LoadingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const finalizeAuth = async () => {
            // 1. Get the ID from the URL (appended by your backend redirect)
            const verificationId = searchParams.get('verificationId');

            if (!verificationId) {
                console.error("No verification ID found in redirect");
                navigate('/login');
                return;
            }

            try {
                // 2. Call your set-cookies endpoint
                const response = await fetch(`https://dorie-lunulate-breezily.ngrok-free.dev/auth/set-cookies?verificationId=${verificationId}`, {
                    method: 'GET',
                    credentials: 'include', // Crucial to allow the browser to save the cookies
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                if (response.ok) {
                    // 3. Success! Set the local flag and go home
                    localStorage.setItem('isLoggedIn', 'true');
                    navigate('/', { replace: true });
                } else {
                    throw new Error("Failed to set cookies");
                }
            } catch (error) {
                console.error("Auth bridge error:", error);
                navigate('/login');
            }
        };

        finalizeAuth();
    }, [navigate, searchParams]);

    return (
        <div className="auth-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="logo" style={{ marginBottom: '20px', justifyContent: 'center' }}>
                    <span>&lt;/&gt;</span> CodeLeat
                </div>
                {/* A simple CSS spinner or pulsing text */}
                <div style={{ color: '#FFB240', fontSize: '1.2rem', fontWeight: '600' }}>
                    Finalizing secure login...
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;