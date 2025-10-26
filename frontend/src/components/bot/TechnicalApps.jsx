import React, { useState, useEffect } from 'react';
import { botService } from '../../services/botService';
import { handleError, formatDate, getStatusColor } from '../../utils/helpers';
import Loader from '../common/Loader';
import './TechnicalApps.css';

const TechnicalApps = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await botService.getTechnicalApplications();
      setApplications(data.applications || []);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAutomation = async (appId) => {
    setProcessing(appId);
    setError('');

    try {
      await botService.triggerAutomation(appId);
      alert('Automation triggered successfully!');
      loadApplications();
    } catch (err) {
      setError(handleError(err));
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <Loader message="Loading technical applications..." />;

  return (
    <div className="technical-apps">
      <h2>Technical Role Applications</h2>
      <p className="subtitle">Applications automatically processed by bot</p>

      {error && <div className="error-message">{error}</div>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>No technical applications to process</p>
        </div>
      ) : (
        <div className="applications-table">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Job Title</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.applicantName || 'Tech Applicant'}</td>
                  <td>{app.jobTitle || 'Software Engineer'}</td>
                  <td>{formatDate(app.createdAt || new Date())}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(app.status || 'Applied') }}
                    >
                      {app.status || 'Applied'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-automation"
                      onClick={() => handleTriggerAutomation(app.id)}
                      disabled={processing === app.id}
                    >
                      {processing === app.id ? '🔄 Processing...' : '🤖 Automate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TechnicalApps;
