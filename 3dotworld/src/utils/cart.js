import axios from 'axios';

const API_URL = 'https://ecommerce-server-fhna.onrender.com/api';

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addToCart = async (productId, quantity = 1) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    const response = await api.post('/cart', {
      productId,
      quantity
    });

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Added to cart successfully!'
    };
  } catch (error) {
    console.error('Add to cart error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to add to cart',
      error: error.response?.data
    };
  }
};

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Get cart error:', error);
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
};

export const updateCartQuantity = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Update cart error:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response.data;
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};