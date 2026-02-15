import React from 'react';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="logo">CodeLeat</div>
      <div className="profile-icon" onClick={() => navigate('/profile')}>U</div>
    </nav>
  );
};

export default Navbar;