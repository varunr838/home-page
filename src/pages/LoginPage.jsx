import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, Github, Chrome } from 'lucide-react';
import '../styles/Auth.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    // Inside LoginPage.jsx
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            // ONLY navigate if we are sure we are logged in.
            // Use replace: true to prevent the user from going "back" into the loop
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("https://dorie-lunulate-breezily.ngrok-free.dev/auth/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true" 
            },
            // The browser will automatically save ACCESS_TOKEN and REFRESH_TOKEN
            credentials: 'include', 
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            })
        });

        if (response.ok) {
            // Even if the tokens are in cookies, we set a flag for our ProtectedRoute
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/');
        } else {
            alert("Invalid email or password");
        }
    } catch (error) {
        console.error("Login error:", error);
    }
};
const handleGoogleLogin = () => {
        // Redirect the entire window to the backend's OAuth entry point
        window.location.href = "https://dorie-lunulate-breezily.ngrok-free.dev/oauth2/authorization/google";
};

    return (
        <div className="auth-wrapper">
            <div className="main-container">
                <section className="content-side">
                    <div className="logo"><span>&lt;/&gt;</span> CodeLeat</div>
                    <div className="hero-section">
                        <h1>Master Coding, <br/>One Problem <br/>at a Time</h1>
                        <p>Join thousands of developers improving their skills with our curated coding challenges.</p>
                    </div>
                    <div className="stats-container">
                        <div className="stat-box"><h2>10K+</h2><p>Problems</p></div>
                        <div className="stat-box"><h2>500K+</h2><p>Users</p></div>
                    </div>
                    <div className="footer-note">© 2026 CodeLeat. All rights reserved.</div>
                </section>

                <section className="form-side">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h2>Welcome back</h2>
                            <p>Sign in to continue your coding journey</p>
                        </div>
                        <div className="social-group">
                            <button className="btn-social"><Github size={18}/> Continue with GitHub</button>
                            <button className="btn-social" onClick={handleGoogleLogin} ><Chrome size={18}/> Continue with Google</button>
                        </div>
                        <div className="divider">or</div>
                        <form onSubmit={handleLogin}>
                            <div className="input-field">
                                <Mail size={18}/><input type="email" placeholder="you@example.com" required 
                                onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                            </div>
                            <div className="input-field">
                                <Lock size={18}/><input type="password" placeholder="••••••••" required
                                onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                            </div>
                            <button type="submit" className="btn-submit">SIGN IN</button>
                        </form>
                        <div className="card-footer">
                            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LoginPage;