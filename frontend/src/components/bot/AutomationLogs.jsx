import React, { useState, useEffect } from 'react';
import { botService } from '../../services/botService';
import { handleError, formatDate } from '../../utils/helpers';
import Loader from '../common/Loader';
import './AutomationLogs.css';

const AutomationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await botService.getAutomationLogs();
      setLogs(data.logs || []);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading automation logs..." />;

  return (
    <div className="automation-logs">
      <h2>Automation Activity Logs</h2>
      <p className="subtitle">Complete traceability of bot actions</p>

      {error && <div className="error-message">{error}</div>}

      {logs.length === 0 ? (
        <div className="empty-state">
          <p>No automation logs available</p>
        </div>
      ) : (
        <div className="logs-timeline">
          {logs.map((log, index) => (
            <div key={index} className="log-item">
              <div className="log-icon">
                {log.success ? '✅' : '❌'}
              </div>
              <div className="log-content">
                <div className="log-title">{log.action}</div>
                <div className="log-details">{log.details}</div>
                <div className="log-time">{formatDate(log.timestamp || new Date())}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomationLogs;
