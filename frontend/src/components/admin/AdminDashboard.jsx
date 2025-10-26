import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ApplicationManager from './ApplicationManager';
import JobPostingManager from './JobPostingManager';
import MetricsView from './MetricsView';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const { user } = useAuth();

  const loadMetrics = async () => {
    try {
      const data = await adminService.getDashboardMetrics();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  // New refresh function to reload all important dashboard data
  const refreshDashboard = async () => {
    await loadMetrics();
    // Add more load functions here if needed, e.g., reload job postings or applications
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      {metrics && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{metrics.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{metrics.technicalApplications}</div>
            <div className="stat-label">Technical</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{metrics.nonTechnicalApplications}</div>
            <div className="stat-label">Non-Technical</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {metrics.statusBreakdown?.Interview || 0}
            </div>
            <div className="stat-label">In Interview</div>
          </div>
        </div>
      )}

      <div className="dashboard-nav">
        <Link to="/admin" className="nav-link">Applications</Link>
        <Link to="/admin/job-postings" className="nav-link">Job Postings</Link>
        <Link to="/admin/metrics" className="nav-link">Detailed Metrics</Link>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route index element={<ApplicationManager />} />
          {/* Pass refreshDashboard prop to JobPostingManager */}
          <Route path="job-postings" element={<JobPostingManager refreshDashboard={refreshDashboard} />} />
          <Route path="metrics" element={<MetricsView />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
