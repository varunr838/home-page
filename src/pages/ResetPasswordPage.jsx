import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import '../styles/Auth.css';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    // Extract verificationId from URL parameters
    const verificationId = searchParams.get('verificationId');

    const handleReset = async (e) => {
        e.preventDefault();

        if (!verificationId) {
            alert("Invalid reset link. Please try requesting a new one.");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("https://dorie-lunulate-breezily.ngrok-free.dev/auth/reset-password", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true" 
                },
                body: JSON.stringify({
                    verificationId: verificationId,
                    newPassword: passwords.newPassword
                })
            });

            if (response.ok) {
                alert("Password reset successfully! Please login with your new password.");
                navigate('/login');
            } else {
                const data = await response.json();
                alert(data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="form-side" style={{ flex: 1, minHeight: '100vh' }}>
                <div className="auth-card" style={{ maxWidth: '400px' }}>
                    <div className="auth-header">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <div style={{ background: 'rgba(255, 178, 64, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                                <Lock size={32} color="#FFB240" />
                            </div>
                        </div>
                        <h2>Reset Password</h2>
                        <p>Enter your new password below</p>
                    </div>

                    <form onSubmit={handleReset}>
                        <div className="input-field">
                            <Lock size={18}/>
                            <input 
                                type="password" 
                                placeholder="New Password" 
                                required
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            />
                        </div>
                        <div className="input-field">
                            <CheckCircle size={18}/>
                            <input 
                                type="password" 
                                placeholder="Confirm New Password" 
                                required
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "RESETTING..." : "RESET PASSWORD"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;