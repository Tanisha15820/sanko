// Base API client placeholder for future backend integration.
// Currently no backend APIs exist; feature services use local sample data and localStorage.
// When the backend is ready, configure API_BASE_URL and implement HTTP requests here.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = {
  baseUrl: API_BASE_URL,

  async request() {
    throw new Error('Backend API is not connected yet.');
  },
};
