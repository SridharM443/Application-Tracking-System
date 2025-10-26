import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import JobList from './JobList';
import MyApplications from './MyApplications';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import './ApplicantDashboard.css';

const ApplicantDashboard = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    reviewed: 0,
    interviews: 0
  });
  const { user } = useAuth();

  // Load stats - callable from children as well
  const loadStats = async () => {
    try {
      const { applications } = await applicationService.getApplications();
      setStats({
        totalApplications: applications.length,
        pending: applications.filter(a => a.status === 'Applied').length,
        reviewed: applications.filter(a => a.status === 'Reviewed').length,
        interviews: applications.filter(a => a.status === 'Interview').length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Load stats once on mount
  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Manage your job applications</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalApplications}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.reviewed}</div>
          <div className="stat-label">Reviewed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.interviews}</div>
          <div className="stat-label">Interviews</div>
        </div>
      </div>

      <div className="dashboard-nav">
        <Link to="/applicant" className="nav-link">Available Jobs</Link>
        <Link to="/applicant/my-applications" className="nav-link">My Applications</Link>
      </div>

      <div className="dashboard-content">
        <Routes>
          {/* Pass loadStats down as reloadStats prop */}
          <Route index element={<JobList reloadStats={loadStats} />} />
          <Route path="my-applications" element={<MyApplications />} />
        </Routes>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
