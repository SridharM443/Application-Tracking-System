import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import { adminService } from '../../services/adminService';
import { handleError, formatDate, getStatusColor } from '../../utils/helpers';
import { APPLICATION_STATUS } from '../../utils/constants';
import Loader from '../common/Loader';
import './ApplicationManager.css';

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: '',
    comment: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await applicationService.getApplications();
      setApplications(data.applications || []);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!statusForm.status) {
      setError('Please select a status.');
      return;
    }
    setUpdating(true);
    setError('');
    console.log('Updating application with:', statusForm);

    try {
      await adminService.updateApplicationStatus(selectedApp._id, statusForm);
      alert('Status updated successfully!');
      setSelectedApp(null);
      setStatusForm({ status: '', comment: '' });
      await loadApplications();
    } catch (err) {
      setError(handleError(err));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader message="Loading applications..." />;

  return (
    <div className="application-manager">
      <h2>Manage Applications</h2>
      <p className="subtitle">Review and update non-technical application statuses</p>

      {error && <div className="error-message">{error}</div>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>No applications to manage</p>
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
                <tr key={app._id}>
                  <td>{app.applicantId?.name || 'Applicant'}</td>
                  <td>{app.jobPostingId?.title || 'Job Position'}</td>
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
                      className="btn-primary btn-sm"
                      onClick={() => {
                        setSelectedApp(app);
                        setStatusForm({ status: app.status || '', comment: '' });
                        setError('');
                      }}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedApp && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Application Status</h3>
              <button onClick={() => setSelectedApp(null)}>×</button>
            </div>
            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label>New Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  required
                >
                  <option value="">Select Status</option>
                  {Object.values(APPLICATION_STATUS).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={statusForm.comment}
                  onChange={(e) => setStatusForm({ ...statusForm, comment: e.target.value })}
                  required
                  rows="4"
                  placeholder="Add a comment about this status change..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setSelectedApp(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={updating}>
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManager;
