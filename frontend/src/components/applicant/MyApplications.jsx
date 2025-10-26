import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import { handleError, formatDate, getStatusColor } from '../../utils/helpers';
import Loader from '../common/Loader';
import './MyApplications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data.applications || []);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const viewHistory = async (appId) => {
    try {
      const data = await applicationService.getApplicationHistory(appId);
      setHistory(data.history || []);
      setSelectedApp(appId);
    } catch (err) {
      setError(handleError(err));
    }
  };

  if (loading) return <Loader message="Loading your applications..." />;

  return (
    <div className="my-applications">
      <h2>My Applications</h2>

      {error && <div className="error-message">{error}</div>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="applications-table">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {applications.map((app) => (
    <tr key={app._id}>
      <td>{app.jobPostingId?.title || 'Job Title'}</td>
      <td>{formatDate(app.createdAt || new Date())}</td>
      <td>
        <span className="status-badge" style={{ backgroundColor: getStatusColor(app.status) }}>
          {app.status}
        </span>
      </td>
      <td>
        <button className="btn-secondary" onClick={() => viewHistory(app._id)}>
          View History
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}

      {selectedApp && (
        <div className="history-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Application History</h3>
              <button onClick={() => setSelectedApp(null)}>×</button>
            </div>
            <div className="history-timeline">
              {history.length === 0 ? (
                <p>No history available</p>
              ) : (
                history.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-date">{formatDate(item.date)}</div>
                    <div className="timeline-status">{item.status}</div>
                    <div className="timeline-comment">{item.comment}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
