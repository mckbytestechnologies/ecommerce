import axios from "axios";

const API = axios.create({
  baseURL: "https://ecommerce-server-fhna.onrender.com",
  withCredentials: true
});

// Attach token if available (prevents 401 crash)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const endpoints = {
  products: "/api/products",
  categories: "/api/categories",
  cart: "/api/cart",
  wishlist: "/api/wishlist"
};

export default API;
