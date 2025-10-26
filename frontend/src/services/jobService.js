import api from './api';

export const jobService = {
  getJobPostings: async (params = {}) => {
    const response = await api.get('/job-postings', { params });
    return response.data;
  },

  getJobPosting: async (id) => {
    const response = await api.get(`/job-postings/${id}`);
    return response.data;
  },

  createJobPosting: async (jobData) => {
    const response = await api.post('/job-postings', jobData);
    return response.data;
  },

  updateJobPosting: async (id, jobData) => {
    const response = await api.put(`/job-postings/${id}`, jobData);
    return response.data;
  },

  deleteJobPosting: async (id) => {
    const response = await api.delete(`/job-postings/${id}`);
    return response.data;
  }
};
