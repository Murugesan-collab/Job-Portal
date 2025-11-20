import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Applications.css';

const Applications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error('Failed to fetch job details');
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      alert('Failed to update application status');
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

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <button onClick={() => navigate('/my-jobs')} className="btn-back">
          ← Back to My Jobs
        </button>
        <h1>Applications for: {job?.title}</h1>
        <p className="job-company">{job?.company}</p>
      </div>

      <div className="filter-section">
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
            Pending ({applications.filter((a) => a.status === 'pending').length})
          </button>
          <button
            className={filter === 'reviewed' ? 'active' : ''}
            onClick={() => setFilter('reviewed')}
          >
            Reviewed ({applications.filter((a) => a.status === 'reviewed').length})
          </button>
          <button
            className={filter === 'shortlisted' ? 'active' : ''}
            onClick={() => setFilter('shortlisted')}
          >
            Shortlisted ({applications.filter((a) => a.status === 'shortlisted').length})
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredApplications.length === 0 ? (
        <div className="no-applications">
          <p>
            {filter === 'all'
              ? 'No applications received yet for this job.'
              : `No ${filter} applications found.`}
          </p>
        </div>
      ) : (
        <div className="applications-list">
          {filteredApplications.map((application) => (
            <div key={application._id} className="application-item">
              <div className="applicant-header">
                <div className="applicant-info">
                  <h3>{application.applicant?.name}</h3>
                  <p className="email">{application.applicant?.email}</p>
                  <p className="phone">{application.applicant?.phone}</p>
                </div>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(application.status) }}
                >
                  {application.status}
                </span>
              </div>

              <div className="applicant-details">
                {application.applicant?.skills && application.applicant.skills.length > 0 && (
                  <div className="detail-section">
                    <h4>Skills:</h4>
                    <div className="skills-list">
                      {application.applicant.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {application.applicant?.experience && (
                  <div className="detail-section">
                    <h4>Experience:</h4>
                    <p>{application.applicant.experience}</p>
                  </div>
                )}

                {application.applicant?.education && (
                  <div className="detail-section">
                    <h4>Education:</h4>
                    <p>{application.applicant.education}</p>
                  </div>
                )}

                {application.coverLetter && (
                  <div className="detail-section">
                    <h4>Cover Letter:</h4>
                    <p className="cover-letter">{application.coverLetter}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Applied On:</h4>
                  <p>
                    {new Date(application.appliedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {application.resume && (
                  <div className="detail-section">
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-resume"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <button
                  onClick={() => handleStatusChange(application._id, 'reviewed')}
                  className="btn-action btn-reviewed"
                  disabled={application.status === 'reviewed'}
                >
                  Mark Reviewed
                </button>
                <button
                  onClick={() => handleStatusChange(application._id, 'shortlisted')}
                  className="btn-action btn-shortlist"
                  disabled={application.status === 'shortlisted'}
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleStatusChange(application._id, 'rejected')}
                  className="btn-action btn-reject"
                  disabled={application.status === 'rejected'}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleStatusChange(application._id, 'accepted')}
                  className="btn-action btn-accept"
                  disabled={application.status === 'accepted'}
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;