import api from '../axios';

const wishlistService = {
  // Get wishlist
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add to wishlist
  addToWishlist: async (propertyId) => {
    const response = await api.post(`/wishlist/${propertyId}`);
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (propertyId) => {
    const response = await api.delete(`/wishlist/${propertyId}`);
    return response.data;
  },

  // Check if property is in wishlist
  checkWishlist: async (propertyId) => {
    const response = await api.get(`/wishlist/check/${propertyId}`);
    return response.data;
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    const response = await api.delete('/wishlist');
    return response.data;
  },
};

export default wishlistService;
