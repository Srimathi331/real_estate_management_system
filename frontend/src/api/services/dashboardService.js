import api from '../axios';

const dashboardService = {
  // Get admin dashboard
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  // Get agent dashboard
  getAgentDashboard: async () => {
    const response = await api.get('/dashboard/agent');
    return response.data;
  },

  // Get user dashboard
  getUserDashboard: async () => {
    const response = await api.get('/dashboard/user');
    return response.data;
  },
};

export default dashboardService;
