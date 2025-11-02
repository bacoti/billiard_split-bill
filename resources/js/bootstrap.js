import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Enable credentials (cookies) for CORS requests
window.axios.defaults.withCredentials = true;

// Set base URL from environment or current origin
window.axios.defaults.baseURL = window.location.origin;

// Set CSRF token for all requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Add request interceptor to handle authentication
window.axios.interceptors.request.use(
    async config => {
        // For API routes, ensure we get CSRF cookie first
        if (config.url.startsWith('/api/') && !config._retry) {
            try {
                // Get CSRF cookie from sanctum/csrf-cookie endpoint
                await window.axios.get('/sanctum/csrf-cookie');
                config._retry = true;
            } catch (error) {
                console.warn('Failed to get CSRF cookie:', error);
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Redirect to login on unauthorized
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

