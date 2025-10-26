import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import { handleError } from '../../utils/helpers';
import { ROLE_TYPES } from '../../utils/constants';
import Loader from '../common/Loader';
import './JobPostingManager.css';

const JobPostingManager = ({ refreshDashboard }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    roleType: ROLE_TYPES.TECHNICAL,
    department: '',
    location: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobService.getJobPostings();
      setJobs(data.jobPostings || []);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingJob) {
        await jobService.updateJobPosting(editingJob._id, formData);
        alert('Job posting updated!');
      } else {
        await jobService.createJobPosting(formData);
        alert('Job posting created!');
      }
      resetForm();
      loadJobs();
    } catch (err) {
      setError(handleError(err));
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      roleType: job.roleType,
      department: job.department,
      location: job.location
    });
    setShowForm(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await jobService.deleteJobPosting(jobId);
        alert('Job posting deleted!');
        loadJobs();
        // Call refreshDashboard prop to reload metrics etc
        if (refreshDashboard) {
          await refreshDashboard();
        }
      } catch (err) {
        setError(handleError(err));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      roleType: ROLE_TYPES.TECHNICAL,
      department: '',
      location: ''
    });
    setEditingJob(null);
    setShowForm(false);
  };

  if (loading) return <Loader message="Loading job postings..." />;

  return (
    <div className="job-posting-manager">
      <div className="header-actions">
        <h2>Manage Job Postings</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Create New Job
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="job-form-card">
          <h3>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
                placeholder="Job description and requirements..."
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Role Type *</label>
                <select
                  value={formData.roleType}
                  onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                >
                  <option value={ROLE_TYPES.TECHNICAL}>Technical</option>
                  <option value={ROLE_TYPES.NON_TECHNICAL}>Non-Technical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department *</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  placeholder="e.g., Engineering"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="e.g., Remote, New York, etc."
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingJob ? 'Update' : 'Create'} Job Posting
              </button>
            </div>
          </form>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="empty-state">
          <p>No job postings yet. Create your first job posting!</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className={`role-badge ${job.roleType}`}>
                  {job.roleType}
                </span>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="job-details">
                <span>🏢 {job.department}</span>
                <span>📍 {job.location}</span>
              </div>
              <div className="job-actions">
                <button className="btn-secondary btn-sm" onClick={() => handleEdit(job)}>
                  Edit
                </button>
                <button className="btn-danger btn-sm" onClick={() => handleDelete(job._id)}>
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

export default JobPostingManager;
