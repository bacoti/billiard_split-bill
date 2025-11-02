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

// Add request interceptor to handle CSRF cookie
window.axios.interceptors.request.use(
    config => {
        // For API routes, ensure we're authenticated
        if (config.url.startsWith('/api/')) {
            // Get CSRF cookie if not already set
            const csrfCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='));
            
            if (!csrfCookie && !config._retry) {
                // Get CSRF cookie from sanctum/csrf-cookie endpoint
                return window.axios.get('/sanctum/csrf-cookie').then(() => {
                    config._retry = true;
                    return config;
                });
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

