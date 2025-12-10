// src/utils/cart.js

const CART_KEY = "my_ecom_cart";

// Get cart
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
};

// Save cart
const saveCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};

// Add item to cart
export const addToCart = (product) => {
  const cart = getCart();

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  return cart;
};

// Update quantity
export const updateQuantity = (id, quantity) => {
  const cart = getCart();
  const updated = cart.map((item) =>
    item.id === id ? { ...item, quantity } : item
  );
  saveCart(updated);
  return updated;
};

// Remove from cart
export const removeFromCart = (id) => {
  const cart = getCart();
  const updated = cart.filter((item) => item.id !== id);
  saveCart(updated);
  return updated;
};

// Clear entire cart
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  return [];
};
