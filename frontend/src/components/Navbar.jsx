import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          JobPortal
        </Link>
        
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/jobs" className="navbar-link">Browse Jobs</Link>
          </li>
          
          {user ? (
            <>
              {user.role === 'employer' && (
                <>
                  <li className="navbar-item">
                    <Link to="/post-job" className="navbar-link">Post Job</Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/my-jobs" className="navbar-link">My Jobs</Link>
                  </li>
                </>
              )}
              
              {user.role === 'jobseeker' && (
                <li className="navbar-item">
                  <Link to="/my-applications" className="navbar-link">My Applications</Link>
                </li>
              )}
              
              <li className="navbar-item">
                <Link to="/profile" className="navbar-link">Profile</Link>
              </li>
              
              <li className="navbar-item">
                <span className="navbar-user">Hello, {user.name}</span>
              </li>
              
              <li className="navbar-item">
                <button onClick={onLogout} className="navbar-button">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-button">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;