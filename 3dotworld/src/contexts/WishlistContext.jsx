import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - Update this based on your setup
  const API_URL = 'http://localhost:5000/api';

  // Get authentication token
  const getToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  // Fetch wishlist from server
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setWishlist(response.data.data.items || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      if (err.response?.status === 401) {
        setWishlist([]);
      }
      setError(err.response?.data?.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('Please login to add items to wishlist');
      }

      const response = await axios.post(
        `${API_URL}/wishlist`,
        { productId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await fetchWishlist();
        return { success: true, message: 'Added to wishlist!' };
      }
      
      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to add to wishlist';
      return { success: false, message };
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('Please login to manage wishlist');
      }

      const response = await axios.delete(`${API_URL}/wishlist/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        await fetchWishlist();
        return { success: true, message: 'Removed from wishlist' };
      }
      
      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to remove from wishlist';
      return { success: false, message };
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => 
      item.product?._id === productId || 
      item.product === productId
    );
  };

  // Toggle wishlist status
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  // Get wishlist count
  const getWishlistCount = () => wishlist.length;

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('Please login to clear wishlist');
      }

      const response = await axios.delete(`${API_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setWishlist([]);
        return { success: true, message: 'Wishlist cleared' };
      }
      
      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to clear wishlist';
      return { success: false, message };
    }
  };

  // Initialize wishlist on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  const value = {
    wishlist,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};