export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  APPLICANT: 'applicant',
  ADMIN: 'admin',
  BOT_MIMIC: 'botMimic'
};

export const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  REVIEWED: 'Reviewed',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected'
};

export const ROLE_TYPES = {
  TECHNICAL: 'technical',
  NON_TECHNICAL: 'non-technical'
};

export const STATUS_COLORS = {
  Applied: '#3b82f6',
  Reviewed: '#f59e0b',
  Interview: '#8b5cf6',
  Offer: '#10b981',
  Rejected: '#ef4444'
};
