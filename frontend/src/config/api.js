// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${baseUrl}${endpoint}`;
};

// Helper function to get socket URL
export const getSocketUrl = () => {
  return import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
};
