import { create } from 'zustand';
import { STORAGE_KEYS } from '@/config/constants';
import { isCentralDomain } from '@/utils/subdomain';

/**
 * Auth Store for managing user session, tokens, and roles.
 * Handles both Central Admin and Tenant User contexts.
 */
const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  role: null, // 'super-admin' | 'tenant-admin' | 'employee'
  isAuthenticated: false,
  isInitialized: false,

  /**
   * Logs in the user and saves the session.
   * @param {Object} userData - User information.
   * @param {string} token - Bearer token.
   * @param {string} role - User role.
   */
  login: (userData, token, role) => {
    const storageKey = isCentralDomain() 
      ? STORAGE_KEYS.CENTRAL_TOKEN 
      : STORAGE_KEYS.TENANT_TOKEN;

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, token);
      localStorage.setItem('user_role', role);
    }

    set({
      user: userData,
      token: token,
      role: role,
      isAuthenticated: true,
    });
  },

  /**
   * Logs out the user and clears all session data.
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CENTRAL_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.TENANT_TOKEN);
      localStorage.removeItem('user_role');
    }

    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
    });
  },

  /**
   * Initializes the auth state from localStorage.
   * Useful for persistent sessions on page refresh.
   */
  initializeAuth: () => {
    if (typeof window === 'undefined') return;

    const storageKey = isCentralDomain() 
      ? STORAGE_KEYS.CENTRAL_TOKEN 
      : STORAGE_KEYS.TENANT_TOKEN;
    
    const token = localStorage.getItem(storageKey);
    const role = localStorage.getItem('user_role');

    if (token) {
      // Note: In a real app, you might want to decode the token or hit a /me endpoint
      set({
        token: token,
        role: role,
        isAuthenticated: true,
        isInitialized: true,
      });
    } else {
      set({ isInitialized: true });
    }
  },

  /**
   * Helper to check if the current user has a specific role.
   * @param {string} roleName 
   * @returns {boolean}
   */
  hasRole: (roleName) => {
    return get().role === roleName;
  },
}));

export default useAuthStore;
