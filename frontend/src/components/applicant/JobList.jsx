import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { handleError } from '../../utils/helpers';
import Loader from '../common/Loader';
import './JobList.css';

const JobList = ({ reloadStats }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(null);
  const [success, setSuccess] = useState('');

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

  const handleApply = async (jobId) => {
    setApplying(jobId);
    setError('');
    setSuccess('');

    try {
      await applicationService.createApplication({ jobPostingId: jobId });
      setSuccess('Application submitted successfully!');

      await loadJobs();

      // Refresh stats in dashboard immediately after apply
      if (reloadStats) {
        await reloadStats();
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <Loader message="Loading available jobs..." />;

  return (
    <div className="job-list">
      <h2>Available Job Openings</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {jobs.length === 0 ? (
        <div className="empty-state">
          <p>No job openings available at the moment.</p>
          <p>Check back later for new opportunities!</p>
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
                <span>📍 {job.location}</span>
                <span>🏢 {job.department}</span>
              </div>
              <button
                className="btn-apply"
                onClick={() => handleApply(job._id)}
                disabled={applying === job._id}
              >
                {applying === job._id ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
