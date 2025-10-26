import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TechnicalApps from './TechnicalApps';
import AutomationLogs from './AutomationLogs';
import { botService } from '../../services/botService';
import { useAuth } from '../../context/AuthContext';
import './BotDashboard.css';

const BotDashboard = () => {
  const [stats, setStats] = useState({
    totalTechnical: 0,
    automated: 0,
    pending: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { applications } = await botService.getTechnicalApplications();
      setStats({
        totalTechnical: applications.length,
        automated: 0,
        pending: applications.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleBatchAutomation = async () => {
    if (window.confirm('Start batch automation for all pending technical applications?')) {
      try {
        await botService.triggerBatchAutomation();
        alert('Batch automation started successfully!');
        loadStats();
      } catch (error) {
        alert('Failed to start batch automation');
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bot Mimic Dashboard</h1>
        <p>Automated processing for technical roles</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTechnical}</div>
          <div className="stat-label">Technical Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.automated}</div>
          <div className="stat-label">Automated</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card action-card">
          <button className="btn-automation" onClick={handleBatchAutomation}>
            🤖 Run Batch Automation
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <Link to="/bot" className="nav-link">Technical Applications</Link>
        <Link to="/bot/logs" className="nav-link">Automation Logs</Link>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route index element={<TechnicalApps />} />
          <Route path="logs" element={<AutomationLogs />} />
        </Routes>
      </div>
    </div>
  );
};

export default BotDashboard;
