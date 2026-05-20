import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/config/constants';

/**
 * Axios instance for the Central Domain (Super Admin).
 * Manages plans, subscriptions, and tenant approvals.
 */
const centralClient = axios.create({
  baseURL: API_CONFIG.CENTRAL_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Super Admin Bearer token
centralClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.CENTRAL_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling (e.g., 401 Unauthorized)
centralClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic for logout or token refresh could go here
      console.error('Central Admin Unauthorized - Redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default centralClient;
