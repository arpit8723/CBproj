import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://your-api-base-url.com',  // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to headers if present in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token'); // Get token from localStorage (or Redux store if preferred)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, add response interceptors for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., logout, redirect to login page)
      console.error('Unauthorized access - logging out');
      // Example: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
