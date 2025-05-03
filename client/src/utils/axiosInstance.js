// /client/src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // your backend base URL
  withCredentials: true, // allow sending cookies (refresh token)
});

// Add interceptor to handle 401 or 403 errors (expired token)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post('/refresh'); // Get new access token
        // Store or update access token if needed
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Optionally redirect to login or logout
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
