import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    skills: '',
    experience: '',
    education: '',
    resume: '',
    companyName: '',
    companyDescription: '',
    website: '',
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setProfileData({
        name: res.data.name || '',
        phone: res.data.phone || '',
        skills: res.data.skills?.join(', ') || '',
        experience: res.data.experience || '',
        education: res.data.education || '',
        resume: res.data.resume || '',
        companyName: res.data.companyName || '',
        companyDescription: res.data.companyDescription || '',
        website: res.data.website || '',
      });
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      
      // Convert skills string to array
      const updateData = {
        ...profileData,
        skills: profileData.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter((skill) => skill),
      };

      await axios.put('http://localhost:5000/api/profile/me', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-edit">
              Edit Profile
            </button>
          )}
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {user?.role === 'jobseeker' && (
              <>
                <div className="form-section">
                  <h2>Professional Information</h2>
                  
                  <div className="form-group">
                    <label>Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={profileData.skills}
                      onChange={handleChange}
                      placeholder="e.g. JavaScript, React, Node.js"
                    />
                    <small>Separate skills with commas</small>
                  </div>

                  <div className="form-group">
                    <label>Experience</label>
                    <textarea
                      name="experience"
                      value={profileData.experience}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe your work experience..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Education</label>
                    <textarea
                      name="education"
                      value={profileData.education}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Your educational background..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Resume URL</label>
                    <input
                      type="url"
                      name="resume"
                      value={profileData.resume}
                      onChange={handleChange}
                      placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                    />
                  </div>
                </div>
              </>
            )}

            {user?.role === 'employer' && (
              <div className="form-section">
                <h2>Company Information</h2>
                
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={profileData.companyName}
                    onChange={handleChange}
                    placeholder="Your company name"
                  />
                </div>

                <div className="form-group">
                  <label>Company Description</label>
                  <textarea
                    name="companyDescription"
                    value={profileData.companyDescription}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about your company..."
                  />
                </div>

                <div className="form-group">
                  <label>Company Website</label>
                  <input
                    type="url"
                    name="website"
                    value={profileData.website}
                    onChange={handleChange}
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="profile-section">
              <h2>Basic Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{profileData.name || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{user?.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{profileData.phone || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Role:</span>
                  <span className="value role-badge">{user?.role}</span>
                </div>
              </div>
            </div>

            {user?.role === 'jobseeker' && (
              <>
                <div className="profile-section">
                  <h2>Skills</h2>
                  {profileData.skills ? (
                    <div className="skills-display">
                      {profileData.skills.split(',').map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No skills added yet</p>
                  )}
                </div>

                <div className="profile-section">
                  <h2>Experience</h2>
                  <p className="text-content">
                    {profileData.experience || 'No experience added yet'}
                  </p>
                </div>

                <div className="profile-section">
                  <h2>Education</h2>
                  <p className="text-content">
                    {profileData.education || 'No education added yet'}
                  </p>
                </div>

                {profileData.resume && (
                  <div className="profile-section">
                    <h2>Resume</h2>
                    <a
                      href={profileData.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-resume"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </>
            )}

            {user?.role === 'employer' && (
              <div className="profile-section">
                <h2>Company Information</h2>
                <div className="info-grid">
                  <div className="info-item full-width">
                    <span className="label">Company Name:</span>
                    <span className="value">{profileData.companyName || 'Not provided'}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="label">Description:</span>
                    <p className="text-content">
                      {profileData.companyDescription || 'No description added yet'}
                    </p>
                  </div>
                  {profileData.website && (
                    <div className="info-item full-width">
                      <span className="label">Website:</span>
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        {profileData.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;