import axios, { AxiosError, type AxiosInstance } from 'axios';

// Centralized axios instance so we can add interceptors (auth, logging, etc.) later.
// Uses Vite environment variable VITE_API_URL as base URL.
// Falls back to empty string so relative paths still work in dev if not set.
const baseURL = import.meta.env.VITE_API_URL || '';

const http: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

// Basic response / error logging (can be expanded later)
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // You can route toast notifications outside the service layer later.
    // For now we just rethrow so callers can handle.
    return Promise.reject(error);
  },
);

export { http };
