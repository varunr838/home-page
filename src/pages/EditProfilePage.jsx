import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api'; 
import '../styles/Profile.css';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // State for text fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        bio: ''
    });

    // State for Photo Handling
    const [photoFile, setPhotoFile] = useState(null); 
    const [photoPreview, setPhotoPreview] = useState(null); 
    const [removePhotoFlag, setRemovePhotoFlag] = useState(false); // Tracks if the user wants to delete the photo

    // 1. Fetch current profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiFetch('/user/get-profile');
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        username: data.username || '',
                        bio: data.bio || ''
                    });
                    
                    if (data.profilePhotoUrl) {
                        setPhotoPreview(data.profilePhotoUrl);
                    }
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Handle File Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setRemovePhotoFlag(false); // Cancel the remove flag if they select a new photo
            
            const objectUrl = URL.createObjectURL(file);
            setPhotoPreview(objectUrl);
        }
    };

    // 3. Handle Photo Deletion (UI Only - Sent on Save)
    const handleRemovePhoto = () => {
        if (!window.confirm("Are you sure you want to remove your profile photo?")) return;
        
        setPhotoFile(null); // Clear any newly selected file
        setPhotoPreview(null); // Clear the UI preview
        setRemovePhotoFlag(true); // Flag to tell the backend to delete it on submit
    };

    // 4. Handle Form Submission (The Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const submissionData = new FormData();
            
            // Append Text Fields
            submissionData.append('firstName', formData.firstName);
            submissionData.append('lastName', formData.lastName);
            submissionData.append('username', formData.username);
            submissionData.append('bio', formData.bio);

            // Append File if a new one was selected
            if (photoFile) {
                submissionData.append('profilePhoto', photoFile);
            }

            // Append removePhoto flag if the user deleted their photo
            // Using 'false' as specified in your instructions
            if (removePhotoFlag) {
                submissionData.append('removePhoto', 'true'); 
            }

            // Using PUT as per your @PutMapping endpoint
            const response = await apiFetch('/user/update-profile', {
                method: 'PUT', 
                body: submissionData
            });

            if (response.ok) {
                alert("Profile Updated Successfully!");
                navigate('/profile');
            } else {
                alert("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("An error occurred.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="profile-wrapper" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Loading...</div>;

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

                <form onSubmit={handleSubmit}>
                    {/* Profile Picture Section */}
                    <div className="form-section">
                        <h2 className="section-title">Profile Picture</h2>
                        <div className="avatar-upload">
                            <div className="avatar-preview">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                                ) : (
                                    <span>
                                        {(formData.firstName?.[0] || '')}{(formData.lastName?.[0] || '')}
                                    </span>
                                )}
                            </div>
                            <div className="avatar-actions">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    style={{ display: 'none' }} 
                                />
                                
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Upload New Photo
                                </button>
                                
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={handleRemovePhoto}
                                    disabled={!photoPreview} // Disable if no photo exists
                                    style={{ opacity: !photoPreview ? 0.5 : 1, cursor: !photoPreview ? 'not-allowed' : 'pointer' }}
                                >
                                    Remove Photo
                                </button>
                                <p className="avatar-info">JPG, PNG or GIF. Max size of 5MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="form-section">
                        <h2 className="section-title">Basic Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label required">First Name</label>
                                <input 
                                    type="text" name="firstName" className="form-input" 
                                    value={formData.firstName} onChange={handleChange} required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label required">Last Name</label>
                                <input 
                                    type="text" name="lastName" className="form-input" 
                                    value={formData.lastName} onChange={handleChange} required 
                                />
                            </div>
                            <div className="form-group full-width">
                                <label className="form-label required">Username</label>
                                <input 
                                    type="text" name="username" className="form-input" 
                                    value={formData.username} onChange={handleChange} required 
                                />
                            </div>
                            <div className="form-group full-width">
                                <label className="form-label">Bio</label>
                                <textarea 
                                    name="bio" className="form-textarea" 
                                    value={formData.bio} onChange={handleChange} 
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/profile')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;