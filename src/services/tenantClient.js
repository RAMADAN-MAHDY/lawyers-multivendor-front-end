import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/config/constants';
import { getSubdomain } from '@/utils/subdomain';

/**
 * Axios instance configured dynamically for Tenant Subdomains.
 * Manages the internal ecosystem of a law firm.
 */
const tenantClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dynamic BaseURL and Tenant Headers interceptor
tenantClient.interceptors.request.use(
  (config) => {
    const subdomain = getSubdomain();

    if (subdomain) {
      // Set dynamic baseURL based on subdomain
      config.baseURL = API_CONFIG.TENANT_BASE_URL_TEMPLATE.replace('{subdomain}', subdomain);
      
      // Inject correct tenant-specific authentication headers
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(STORAGE_KEYS.TENANT_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Optional: Inject subdomain as a custom header for backend verification
        config.headers['X-Tenant-ID'] = subdomain;
      }
    } else {
      // Fallback or error handling if no subdomain is detected on a tenant route
      console.warn('No subdomain detected for tenant API call.');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for tenant-specific error handling
tenantClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Tenant User Unauthorized - Redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default tenantClient;
