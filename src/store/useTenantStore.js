import { create } from 'zustand';

/**
 * Tenant Store for managing current firm metadata.
 * Populated after subdomain verification.
 */
const useTenantStore = create((set) => ({
  tenantInfo: null, // { id, name, logo, plan, status, settings }
  isLoadingTenant: false,
  tenantError: null,

  /**
   * Sets the current tenant metadata.
   * @param {Object} info 
   */
  setTenantInfo: (info) => {
    set({
      tenantInfo: info,
      isLoadingTenant: false,
      tenantError: null,
    });
  },

  /**
   * Updates the loading state during verification.
   * @param {boolean} loading 
   */
  setLoadingTenant: (loading) => {
    set({ isLoadingTenant: loading });
  },

  /**
   * Sets an error if tenant verification fails.
   * @param {string} error 
   */
  setTenantError: (error) => {
    set({
      tenantError: error,
      isLoadingTenant: false,
      tenantInfo: null,
    });
  },

  /**
   * Clears tenant information (e.g., on logout or domain switch).
   */
  clearTenantInfo: () => {
    set({
      tenantInfo: null,
      isLoadingTenant: false,
      tenantError: null,
    });
  },
}));

export default useTenantStore;
