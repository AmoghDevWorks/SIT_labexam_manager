import axios from 'axios';

/**
 * Configure axios to automatically include JWT token in all requests
 */

// Add request interceptor to include JWT token
axios.interceptors.request.use(
  (config) => {
    // Select token based on current route context.
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');

    const currentPath = window.location.pathname || '';
    const isAdminRoute = currentPath.startsWith('/admin') || currentPath === '/loginAdmin';

    let token = null;

    // If both are present, use route-aware token to avoid role mixups.
    if (adminToken && userToken) {
      token = isAdminRoute ? adminToken : userToken;
    } else {
      token = adminToken || userToken;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const message = error.response?.data?.message || '';
      
      if (message.includes('Token expired') || message.includes('Invalid token') || message.includes('No token')) {
        // Clear tokens and redirect to login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUid');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userUid');
        localStorage.removeItem('userName');
        
        // Show alert to user
        alert('Your session has expired. Please log in again.');
        
        // Redirect to home page
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;
