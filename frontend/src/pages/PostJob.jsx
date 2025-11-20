import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostJob.css';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    jobType: 'Full-time',
    salary: '',
    skills: '',
    experience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      // Convert skills string to array
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      };

      await axios.post(
        'http://localhost:5000/api/jobs',
        jobData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Job posted successfully!');
      setTimeout(() => {
        navigate('/my-jobs');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <div className="post-job-card">
        <h1>Post a New Job</h1>
        <p className="subtitle">Fill in the details to create a job listing</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="post-job-form">
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="e.g. Tech Corp"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. New York, NY or Remote"
              />
            </div>

            <div className="form-group">
              <label>Job Type *</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary Range</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $80,000 - $120,000"
              />
            </div>

            <div className="form-group">
              <label>Experience Required</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 3-5 years"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Describe the job role, responsibilities, and what the candidate will be doing..."
            />
          </div>

          <div className="form-group">
            <label>Requirements *</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows="6"
              placeholder="List the qualifications, education, and experience required for this position..."
            />
          </div>

          <div className="form-group">
            <label>Required Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, React, Node.js, MongoDB"
            />
            <small>Separate skills with commas</small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => navigate('/my-jobs')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;