import axios from 'axios';

const API_BASE = 'https://ecommerce-server-fhna.onrender.com/api';
const PRODUCTS_API = `${API_BASE}/products`;

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// 请求拦截器，自动添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理认证错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 产品 API
export const productAPI = {
  // 获取产品列表
  getProducts: async (filters = {}) => {
    const params = {
      ...filters,
      isActive: filters.isActive !== undefined ? filters.isActive : true,
    };
    
    const response = await api.get('/products', { params });
    return response.data;
  },

  // 获取单个产品
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // 创建产品
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // 更新产品
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // 删除产品
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // 切换产品状态
  toggleProductStatus: async (id, isActive) => {
    const response = await api.put(`/products/${id}`, { isActive });
    return response.data;
  },
};

export default api;