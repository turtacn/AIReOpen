import axios from 'axios';

// Get base URL from environment variable, default to '/api/v1' if not set
const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const baseURL = apiBase.startsWith('http') ? apiBase : apiBase;

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
