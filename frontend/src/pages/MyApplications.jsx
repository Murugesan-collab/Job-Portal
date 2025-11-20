import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyApplications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/applications/my-applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      setError('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      reviewed: '#17a2b8',
      shortlisted: '#28a745',
      rejected: '#dc3545',
      accepted: '#28a745',
    };
    return colors[status] || '#6c757d';
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading your applications...</div>;
  }

  return (
    <div className="my-applications-container">
      <div className="applications-header">
        <h1>My Applications</h1>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All ({applications.length})
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pending ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button 
            className={filter === 'reviewed' ? 'active' : ''} 
            onClick={() => setFilter('reviewed')}
          >
            Reviewed ({applications.filter(a => a.status === 'reviewed').length})
          </button>
          <button 
            className={filter === 'shortlisted' ? 'active' : ''} 
            onClick={() => setFilter('shortlisted')}
          >
            Shortlisted ({applications.filter(a => a.status === 'shortlisted').length})
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredApplications.length === 0 ? (
        <div className="no-applications">
          <p>
            {filter === 'all' 
              ? "You haven't applied to any jobs yet." 
              : `No ${filter} applications found.`}
          </p>
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="applications-list">
          {filteredApplications.map((application) => (
            <div key={application._id} className="application-card">
              <div className="application-header">
                <div className="job-info">
                  <h3>{application.job?.title}</h3>
                  <p className="company">{application.job?.company}</p>
                  <p className="location">{application.job?.location}</p>
                </div>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(application.status) }}
                >
                  {application.status}
                </span>
              </div>

              <div className="application-details">
                <div className="detail-item">
                  <span className="label">Applied on:</span>
                  <span className="value">
                    {new Date(application.appliedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Job Type:</span>
                  <span className="value">{application.job?.jobType}</span>
                </div>
              </div>

              {application.coverLetter && (
                <div className="cover-letter">
                  <h4>Your Cover Letter:</h4>
                  <p>{application.coverLetter.substring(0, 150)}...</p>
                </div>
              )}

              <div className="application-actions">
                <Link 
                  to={`/jobs/${application.job?._id}`} 
                  className="btn-view-job"
                >
                  View Job
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;