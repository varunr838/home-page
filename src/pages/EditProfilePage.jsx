import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const EditProfilePage = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Developer',
        username: 'johndeveloper',
        bio: 'Full-stack developer passionate about algorithms and problem-solving. Love tackling challenging problems and learning new technologies.'
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: false });
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        // Validation Logic mimicking the HTML Script
        const newErrors = {};
        let isValid = true;

        if (!formData.firstName.trim()) { newErrors.firstName = true; isValid = false; }
        if (!formData.lastName.trim()) { newErrors.lastName = true; isValid = false; }
        if (!formData.username.trim()) { newErrors.username = true; isValid = false; }

        setErrors(newErrors);

        if (isValid) {
            // Integration Point: await fetch('/user/update', ...)
            alert('Profile updated successfully! 🎉');
            navigate('/profile');
        } else {
            alert('Please fill in all required fields.');
        }
    };

    return (
        <div className="profile-wrapper">
            <header className="header">
                <div className="header-content">
                    <div className="logo">CodeLeat</div>
                    <button onClick={() => navigate('/profile')} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span>←</span>
                        <span>Back to Profile</span>
                    </button>
                </div>
            </header>

            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="page-header" style={{ marginBottom: '2rem' }}>
                    <h1 className="username">Edit Profile</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Update your personal information and preferences</p>
                </div>

                {/* Profile Picture Section */}
                <div className="form-section">
                    <h2 className="section-title">Profile Picture</h2>
                    <div className="avatar-upload">
                        <div className="avatar">JD</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button className="btn btn-secondary">Upload New Photo</button>
                            <button className="btn btn-danger">Remove Photo</button>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>JPG, PNG or GIF. Max size of 5MB.</p>
                        </div>
                    </div>
                </div>

                {/* Basic Information Form */}
                <div className="form-section">
                    <h2 className="section-title">Basic Information</h2>
                    <form className="form-grid">
                        <div className="form-group">
                            <label className="form-label required">First Name</label>
                            <input 
                                type="text" 
                                name="firstName"
                                className="form-input" 
                                value={formData.firstName} 
                                onChange={handleChange}
                                placeholder="Enter your first name"
                                style={{ borderColor: errors.firstName ? 'var(--danger)' : '' }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Last Name</label>
                            <input 
                                type="text" 
                                name="lastName"
                                className="form-input" 
                                value={formData.lastName} 
                                onChange={handleChange}
                                placeholder="Enter your last name"
                                style={{ borderColor: errors.lastName ? 'var(--danger)' : '' }}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label required">Username</label>
                            <input 
                                type="text" 
                                name="username"
                                className="form-input" 
                                value={formData.username} 
                                onChange={handleChange}
                                placeholder="Enter username"
                                style={{ borderColor: errors.username ? 'var(--danger)' : '' }}
                            />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>This will be your unique identifier</p>
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Bio</label>
                            <textarea 
                                name="bio"
                                className="form-textarea" 
                                value={formData.bio} 
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                            />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Brief description for your profile. Max 200 characters.</p>
                        </div>
                    </form>
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/profile')}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;