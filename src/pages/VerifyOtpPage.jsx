import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import '../styles/Auth.css';

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    // Get the ID passed from the Signup page
    const [verificationId,setVerificationId] = useState(location.state?.verificationId);
    const email = location.state?.email;

    const handleResend = async (e) => {
        e.preventDefault();
        if (!verificationId) {
            alert("Session expired. Please sign up again.");
            return navigate('/signup');
        }
        try {
            const response = await fetch("https://dorie-lunulate-breezily.ngrok-free.dev/auth/resend-otp", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true" 
                },
                // Include credentials if the server sets auth cookies here
                credentials: 'include', 
                body: JSON.stringify({
                    verificationId: verificationId,
                    email: email
                })
            });
            const data = await response.json();
            console.log(data.verificationId);
            if (response.ok) {
                // If the backend doesn't return a token in JSON but sets cookies:
                // localStorage.setItem('isLoggedIn', 'true');
                setVerificationId(data.verificationId);
                alert('Otp resent, please check your inbox')
            } else {
                alert("Error.");
            }
        } catch (error) {
            console.error("OTP Error:", error);
        }
    }
    const handleVerify = async (e) => {
        e.preventDefault();
        if (!verificationId) {
            alert("Session expired. Please sign up again.");
            return navigate('/signup');
        }

        setLoading(true);
        try {
            const response = await fetch("https://dorie-lunulate-breezily.ngrok-free.dev/auth/verify-otp", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true" 
                },
                // Include credentials if the server sets auth cookies here
                credentials: 'include', 
                body: JSON.stringify({
                    verificationId: verificationId,
                    enteredOtp: otp
                })
            });

            if (response.ok) {
                // If the backend doesn't return a token in JSON but sets cookies:
                // localStorage.setItem('isLoggedIn', 'true');
                navigate('/login');
            } else {
                alert("Invalid OTP. Please check your email.");
            }
        } catch (error) {
            console.error("OTP Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="form-side" style={{ flex: 1 }}>
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <div className="auth-header">
                        <ShieldCheck size={48} color="#FFB240" style={{ marginBottom: '16px' }}/>
                        <h2>Verify your Email</h2>
                        <p>Enter the OTP sent to <strong>{email || 'your email'}</strong></p>
                    </div>
                    
                    <form onSubmit={handleVerify}>
                        <div className="input-field" style={{ justifyContent: 'center' }}>
                            <input 
                                type="text" 
                                placeholder="Enter 6-digit OTP" 
                                maxLength="6"
                                style={{ paddingLeft: '12px', textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem' }}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "VERIFYING..." : "VERIFY OTP"}
                        </button>
                    </form>

                    <div className="card-footer">
                        <p>Didn't receive code? <button className="forgot-link" style={{ background: 'none', border: 'none', cursor: 'pointer' } } onClick = {handleResend} >Resend</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtpPage;