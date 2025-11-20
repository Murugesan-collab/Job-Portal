import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JobDetails.css';

const JobDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'jobseeker') {
      setError('Only job seekers can apply for jobs');
      return;
    }

    setApplying(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/applications',
        {
          jobId: id,
          coverLetter,
          resume: resume || user.resume || 'Not provided'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage('Application submitted successfully!');
      setCoverLetter('');
      setResume('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading job details...</div>;
  }

  if (!job) {
    return <div className="error">Job not found</div>;
  }

  return (
    <div className="job-details-container">
      <div className="job-details-card">

        <div className="job-header">
          <h1>{job.title}</h1>
          <p className="company-name">{job.company}</p>
        </div>

        <div className="job-meta">
          <span className="meta-item"><strong>Type:</strong> {job.jobType}</span>
          <span className="meta-item"><strong>Location:</strong> {job.location}</span>

          {job.salary && (
            <span className="meta-item"><strong>Salary:</strong> {job.salary}</span>
          )}

          {job.experience && (
            <span className="meta-item"><strong>Experience:</strong> {job.experience}</span>
          )}
        </div>

        <div className="job-section">
          <h2>Job Description</h2>
          <p>{job.description}</p>
        </div>

        <div className="job-section">
          <h2>Requirements</h2>
          <p>{job.requirements}</p>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="job-section">
            <h2>Required Skills</h2>
            <div className="skills-list">
              {job.skills.map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>
        )}

        <div className="job-section">
          <h2>Posted By</h2>
          <p>{job.postedBy?.companyName || job.postedBy?.name}</p>

          {job.postedBy?.website && (
            <a
              href={job.postedBy.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </a>
          )}
        </div>

        {user?.role === 'jobseeker' && (
          <div className="application-section">
            <h2>Apply for this Position</h2>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleApply} className="application-form">
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're a great fit..."
                  rows="6"
                />
              </div>

              <div className="form-group">
                <label>Resume URL (optional)</label>
                <input
                  type="text"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Enter resume URL"
                />
              </div>

              <button
                type="submit"
                className="btn-apply"
                disabled={applying}
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {!user && (
          <div className="login-prompt">
            <p>Please log in to apply for this job</p>
            <button onClick={() => navigate('/login')} className="btn-login">
              Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default JobDetails;