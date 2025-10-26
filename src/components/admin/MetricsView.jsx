import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { handleError } from '../../utils/helpers';
import { APPLICATION_STATUS } from '../../utils/constants';
import Loader from '../common/Loader';
import './MetricsView.css';

const MetricsView = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await adminService.getDashboardMetrics();
      setMetrics(data.metrics);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading metrics..." />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="metrics-view">
      <h2>Detailed Metrics & Analytics</h2>

      <div className="metrics-grid">
        <div className="metric-card large">
          <h3>Total Applications</h3>
          <div className="metric-value">{metrics?.totalApplications || 0}</div>
        </div>

        <div className="metric-card">
          <h3>Technical Roles</h3>
          <div className="metric-value blue">{metrics?.technicalApplications || 0}</div>
          <p className="metric-label">Automated by Bot</p>
        </div>

        <div className="metric-card">
          <h3>Non-Technical Roles</h3>
          <div className="metric-value orange">{metrics?.nonTechnicalApplications || 0}</div>
          <p className="metric-label">Manual Review</p>
        </div>
      </div>

      <div className="status-breakdown">
        <h3>Status Breakdown</h3>
        <div className="status-grid">
          {Object.entries(metrics?.statusBreakdown || {}).map(([status, count]) => (
            <div key={status} className="status-item">
              <div className="status-count">{count}</div>
              <div className="status-name">{status}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        {metrics?.recentActivities?.length === 0 ? (
          <p>No recent activities</p>
        ) : (
          <div className="activity-list">
            {metrics?.recentActivities?.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsView;
