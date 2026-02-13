import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AtSign } from 'lucide-react';
import '../styles/Auth.css';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://dorie-lunulate-breezily.ngrok-free.dev/auth/sign-up", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true" 
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                // Navigate to OTP page and pass the verificationID in the state
                navigate('/verify-otp', { state: { verificationId: data.verificationId, email: formData.email } });
            } else {
                alert(data.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                            <h2>Create your account</h2>
                            <p>Start your coding journey today</p>
                        </div>
                        <form onSubmit={handleSignup}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="input-field"><input name="firstName" placeholder="First Name" required onChange={handleChange}/></div>
                                <div className="input-field"><input name="lastName" placeholder="Last Name" required onChange={handleChange}/></div>
                            </div>
                            <div className="input-field">
                                <AtSign size={18}/><input name="username" placeholder="Username" required onChange={handleChange}/>
                            </div>
                            <div className="input-field">
                                <Mail size={18}/><input name="email" type="email" placeholder="Email ID" required onChange={handleChange}/>
                            </div>
                            <div className="input-field">
                                <Lock size={18}/><input name="password" type="password" placeholder="Password" required onChange={handleChange}/>
                            </div>
                            <button type="submit" className="btn-submit">CREATE ACCOUNT</button>
                        </form>
                        <div className="card-footer">
                            <p>Already have an account? <Link to="/login">Sign in</Link></p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SignupPage;