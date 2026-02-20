import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api'; // Import your API utility

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      // Call the backend to invalidate the session/cookies
      await apiFetch('/auth/logout', {
        method: 'POST' // Assuming POST. Change to 'GET' if your backend expects that
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Regardless of backend success/failure, clear local state and force redirect
      localStorage.removeItem('isLoggedIn');
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="navbar">
      {/* Make logo clickable to go home */}
      <div 
        className="logo" 
        onClick={() => navigate('/')} 
        style={{ cursor: 'pointer' }}
      >
        CodeLeat
      </div>
      
      {/* Container to handle hover state */}
      <div 
        className="profile-container"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
        style={{ position: 'relative', paddingBottom: '10px', marginBottom: '-10px' }} // Padding ensures hover doesn't break when moving mouse to dropdown
      >
        <div className="profile-icon" onClick={() => navigate('/profile')}>
          U
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => navigate('/profile')}>
              My Profile
            </div>
            <div className="dropdown-item text-danger" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;