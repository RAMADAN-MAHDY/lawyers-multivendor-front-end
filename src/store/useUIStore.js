import { create } from 'zustand';

/**
 * UI Store for managing global layout and interface states.
 */
const useUIStore = create((set) => ({
  sidebarOpen: true,
  activeModals: {}, // To handle multiple modals by ID

  /**
   * Toggles the sidebar visibility.
   */
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  /**
   * Explicitly sets the sidebar state.
   * @param {boolean} isOpen 
   */
  setSidebarOpen: (isOpen) => {
    set({ sidebarOpen: isOpen });
  },

  /**
   * Opens a modal by its unique ID.
   * @param {string} modalId 
   * @param {Object} data - Optional data to pass to the modal
   */
  openModal: (modalId, data = {}) => {
    set((state) => ({
      activeModals: {
        ...state.activeModals,
        [modalId]: { isOpen: true, data },
      },
    }));
  },

  /**
   * Closes a specific modal.
   * @param {string} modalId 
   */
  closeModal: (modalId) => {
    set((state) => ({
      activeModals: {
        ...state.activeModals,
        [modalId]: { isOpen: false, data: null },
      },
    }));
  },
}));

export default useUIStore;
