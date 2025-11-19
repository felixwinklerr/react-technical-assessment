import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

/**
 * API Service Configuration
 * 
 * DESIGN DECISIONS:
 * 
 * 1. Axios Instance Pattern:
 *    - Single axios instance with shared configuration
 *    - Ensures consistent headers and base URL across all requests
 *    - Easier to mock/test than using axios directly
 * 
 * 2. Request Interceptor:
 *    - Automatically attaches JWT token from localStorage to all requests
 *    - Eliminates need to manually add Authorization header in every API call
 *    - Token is added as "Bearer <token>" following JWT best practices
 * 
 * 3. Response Interceptor:
 *    - Global error handling for authentication failures (401)
 *    - Auto-logout and redirect to login on token expiration
 *    - Prevents need for repetitive error handling in components
 * 
 * 4. API Organization:
 *    - Grouped by feature (auth, products, cart) for maintainability
 *    - Returns response.data directly to reduce boilerplate in components
 *    - Async/await pattern for cleaner error handling
 */

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds JWT token to all authenticated requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Add Bearer token to Authorization header for JWT authentication
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles global error cases, particularly authentication failures
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors globally
    // This occurs when token is invalid/expired
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Products API calls
export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};

// Cart API calls
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },
  
  updateCartItem: async (productId, quantity) => {
    const response = await api.put('/cart', { productId, quantity });
    return response.data;
  },
  
  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },
};

export default api;

