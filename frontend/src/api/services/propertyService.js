import api from '../axios';

const propertyService = {
  // Get all properties with filters
  getProperties: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        queryParams.append(key, value);
      }
    });

    const response = await api.get(`/properties?${queryParams.toString()}`);
    return response.data;
  },

  // Get single property by ID
  getProperty: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property (Agent only)
  createProperty: async (propertyData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.entries(propertyData).forEach(([key, value]) => {
      if (key === 'images') {
        // Handle images separately
        value.forEach((image) => {
          formData.append('images', image);
        });
      } else if (key === 'location' || key === 'features' || key === 'amenities') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    const response = await api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const formData = new FormData();
    
    Object.entries(propertyData).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      } else if (key === 'location' || key === 'features' || key === 'amenities' || key === 'removeImages') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await api.put(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Get my properties (Agent)
  getMyProperties: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/properties/agent/my-properties?${queryParams}`);
    return response.data;
  },

  // Approve/Reject property (Admin)
  approveProperty: async (id, isApproved) => {
    const response = await api.put(`/properties/${id}/approve`, { isApproved });
    return response.data;
  },

  // Toggle featured (Admin)
  toggleFeatured: async (id) => {
    const response = await api.put(`/properties/${id}/featured`);
    return response.data;
  },
};

export default propertyService;
