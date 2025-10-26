import api from './api';

export const applicationService = {
  createApplication: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  getApplications: async (params = {}) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  getApplication: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  getApplicationHistory: async (id) => {
    const response = await api.get(`/applications/${id}/history`);
    return response.data;
  }
};
