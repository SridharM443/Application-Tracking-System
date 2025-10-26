import { format } from 'date-fns';

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const getStatusColor = (status) => {
  const colors = {
    Applied: '#3b82f6',
    Reviewed: '#f59e0b',
    Interview: '#8b5cf6',
    Offer: '#10b981',
    Rejected: '#ef4444'
  };
  return colors[status] || '#6b7280';
};

export const handleError = (error) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred';
  }
  return error.message || 'Network error';
};
