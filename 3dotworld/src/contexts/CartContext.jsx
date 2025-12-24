import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const token = getToken();
      if (!token) {
        setCart({ items: [] });
        setCartCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await fetch('https://ecommerce-server-fhna.onrender.com/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data);
        setCartCount(data.data?.items?.length || 0);
        setError(null);
      } else {
        throw new Error('Failed to fetch cart');
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err);
      setCart({ items: [] });
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Please login to add items to cart');
      }

      const response = await fetch('https://ecommerce-server-fhna.onrender.com/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update local cart state
        await fetchCart();
        // Dispatch event for other components
        window.dispatchEvent(new Event('cartUpdated'));
        return { success: true, data };
      } else {
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: error.message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      const token = getToken();
      const response = await fetch(`https://ecommerce-server-fhna.onrender.com/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      const token = getToken();
      const response = await fetch(`https://ecommerce-server-fhna.onrender.com/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        await fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const token = getToken();
      const response = await fetch('https://ecommerce-server-fhna.onrender.com/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCart({ items: [] });
        setCartCount(0);
        window.dispatchEvent(new Event('cartUpdated'));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCart();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      fetchCart();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};