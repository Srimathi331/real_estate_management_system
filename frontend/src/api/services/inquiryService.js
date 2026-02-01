import api from '../axios';

const inquiryService = {
  // Create inquiry
  createInquiry: async (inquiryData) => {
    const response = await api.post('/inquiries', inquiryData);
    return response.data;
  },

  // Get all inquiries (Agent/Admin)
  getInquiries: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/inquiries?${queryParams}`);
    return response.data;
  },

  // Get single inquiry
  getInquiry: async (id) => {
    const response = await api.get(`/inquiries/${id}`);
    return response.data;
  },

  // Update inquiry status
  updateInquiry: async (id, data) => {
    const response = await api.put(`/inquiries/${id}`, data);
    return response.data;
  },

  // Delete inquiry (Admin)
  deleteInquiry: async (id) => {
    const response = await api.delete(`/inquiries/${id}`);
    return response.data;
  },

  // Get my sent inquiries
  getMyInquiries: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/inquiries/my-inquiries?${queryParams}`);
    return response.data;
  },
};

export default inquiryService;
