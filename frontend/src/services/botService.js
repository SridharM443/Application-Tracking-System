import api from './api';

export const botService = {
  triggerAutomation: async (id) => {
    const response = await api.post(`/bot/trigger/${id}`);
    return response.data;
  },

  triggerBatchAutomation: async () => {
    const response = await api.post('/bot/trigger-batch');
    return response.data;
  },

  getTechnicalApplications: async () => {
    const response = await api.get('/bot/technical-apps');
    return response.data;
  },

  getAutomationLogs: async () => {
    const response = await api.get('/bot/logs');
    return response.data;
  }
};
