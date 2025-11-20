import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyJobs.css';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/jobs/employer/my-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job');
    }
  };

  const handleStatusToggle = async (jobId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      
      await axios.put(
        `http://localhost:5000/api/jobs/${jobId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setJobs(jobs.map(job => 
        job._id === jobId ? { ...job, status: newStatus } : job
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update job status');
    }
  };

  if (loading) {
    return <div className="loading">Loading your jobs...</div>;
  }

  return (
    <div className="my-jobs-container">
      <div className="my-jobs-header">
        <h1>My Posted Jobs</h1>
        <Link to="/post-job" className="btn-post-new">
          + Post New Job
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {jobs.length === 0 ? (
        <div className="no-jobs">
          <p>You haven't posted any jobs yet.</p>
          <Link to="/post-job" className="btn-primary">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className={`job-card ${job.status === 'closed' ? 'closed' : ''}`}>
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className={`status-badge ${job.status}`}>
                  {job.status}
                </span>
              </div>
              
              <div className="job-card-details">
                <p className="company">{job.company}</p>
                <p className="location">{job.location}</p>
                <p className="job-type">{job.jobType}</p>
              </div>

              <div className="job-card-stats">
                <div className="stat">
                  <span className="stat-number">{job.applicants?.length || 0}</span>
                  <span className="stat-label">Applicants</span>
                </div>
                <div className="stat">
                  <span className="stat-date">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <span className="stat-label">Posted</span>
                </div>
              </div>

              <div className="job-card-actions">
                <Link 
                  to={`/applications/${job._id}`} 
                  className="btn-action btn-view"
                >
                  View Applications
                </Link>
                <button
                  onClick={() => handleStatusToggle(job._id, job.status)}
                  className={`btn-action ${job.status === 'active' ? 'btn-close' : 'btn-open'}`}
                >
                  {job.status === 'active' ? 'Close' : 'Reopen'}
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="btn-action btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;