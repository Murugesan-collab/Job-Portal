import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import Applications from './pages/Applications';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/jobs" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/jobs" /> : <Register onLogin={handleLogin} />} 
          />
          <Route path="/jobs" element={<JobList user={user} />} />
          <Route path="/jobs/:id" element={<JobDetails user={user} />} />
          <Route 
            path="/post-job" 
            element={user?.role === 'employer' ? <PostJob /> : <Navigate to="/jobs" />} 
          />
          <Route 
            path="/my-jobs" 
            element={user?.role === 'employer' ? <MyJobs /> : <Navigate to="/jobs" />} 
          />
          <Route 
            path="/my-applications" 
            element={user?.role === 'jobseeker' ? <MyApplications /> : <Navigate to="/jobs" />} 
          />
          <Route 
            path="/applications/:jobId" 
            element={user?.role === 'employer' ? <Applications /> : <Navigate to="/jobs" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;