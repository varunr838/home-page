import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Github, Chrome } from 'lucide-react';
import '../styles/Auth.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("https://dorie-lunulate-breezily.ngrok-free.dev/auth/login", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true" 
                },
                credentials: 'include', 
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });
            const data = await response.json();
            
            if (response.ok) {
                if(data.status === 'EMAIL_NOT_VERIFIED'){
                    alert("Please verify your email ID");
                    navigate('/verify-otp', { state: { verificationId: data.verificationId, email: formData.email} });
                    return;            
                }
                localStorage.setItem('isLoggedIn', 'true');
                navigate('/');
            } else {
                alert(data.message || "Invalid email or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "https://dorie-lunulate-breezily.ngrok-free.dev/oauth2/authorization/google";
    };

    // --- New Forgot Password Logic ---
    const handleForgotPassword = async (e) => {
        e.preventDefault(); // Prevent form submission if button is inside form
        
        if (!formData.email) {
            alert("Please enter your email address in the field above to reset your password.");
            return;
        }

        try {
            const response = await fetch("https://dorie-lunulate-breezily.ngrok-free.dev/auth/forgot-password", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true" 
                },
                body: JSON.stringify({ email: formData.email })
            });

            if (response.ok) {
                alert(`Password reset link sent to ${formData.email}. Please check your inbox.`);
            } else {
                const data = await response.json();
                alert(data.message || "Failed to send reset link.");
            }
        } catch (error) {
            console.error("Forgot Password error:", error);
            alert("Error sending request.");
        }
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
                            <button className="btn-social" onClick={handleGoogleLogin} ><Chrome size={18}/> Continue with Google</button>
                        </div>
                        <div className="divider">or</div>
                        
                        <form onSubmit={handleLogin}>
                            <div className="input-field">
                                <Mail size={18}/><input type="email" placeholder="you@example.com" required 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                            </div>
                            
                            <div className="input-box">
                                {/* Added Forgot Password Link */}
                                
                                <div className="input-field">
                                    <Lock size={18}/><input type="password" placeholder="Password" required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleForgotPassword} 
                                    className="forgot-link"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', float: 'right', padding: 0 }}
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? "SIGNING IN..." : "SIGN IN"}
                            </button>
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