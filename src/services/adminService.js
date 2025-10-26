import api from './api';

export const adminService = {
  updateApplicationStatus: async (id, statusData) => {
    console.log('Sending update for application:', id, statusData);
    const response = await api.put(`/admin/applications/${id}/status`, statusData);
    return response.data;
  },

  addComment: async (id, commentData) => {
    const response = await api.post(`/admin/applications/${id}/comment`, commentData);
    return response.data;
  },

  getDashboardMetrics: async () => {
    const response = await api.get('/admin/metrics');
    return response.data;
  }
};
