import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './JobList.css';

const JobList = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.location) {
        params.append('location', filters.location);
      }
      if (filters.jobType) {
        params.append('jobType', filters.jobType);
      }

      const queryString = params.toString();
      const url = queryString 
        ? http://localhost:5000/api/jobs?${queryString} :
         'http://localhost:5000/api/jobs';

      const res = await axios.get(url);
      setJobs(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
    });
    // Fetch all jobs after clearing filters
    setTimeout(() => {
      fetchJobs();
    }, 0);
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  return (
    <div className="job-list-container">
      <div className="job-list-header">
        <h1>Browse Jobs</h1>
        
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            placeholder="Search by title or company..."
            value={filters.search}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location..."
            value={filters.location}
            onChange={handleFilterChange}
          />
          <select 
            name="jobType" 
            value={filters.jobType} 
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <button type="submit" className="btn-search">Search</button>
          <button 
            type="button" 
            className="btn-clear" 
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="job-list">
        {jobs.length === 0 ? (
          <div className="no-jobs">
            <p>No jobs found. Try adjusting your filters.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p className="company">{job.company}</p>
              <div className="job-details">
                <span className="job-type">{job.jobType}</span>
                <span className="location">{job.location}</span>
                {job.salary && <span className="salary">{job.salary}</span>}
              </div>
              <p className="description">
                {job.description.substring(0, 150)}...
              </p>
              {job.skills && job.skills.length > 0 && (
                <div className="skills">
                  {job.skills.slice(0, 5).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              )}
              <Link to={`/jobs/${job._id}`} className="btn-view">
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobList;