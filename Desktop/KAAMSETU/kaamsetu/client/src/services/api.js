import axios from 'axios';

// Determine API base URL
// In production (Vercel), use VITE_API_URL env var or default
// In development, use /api proxy
const getBaseURL = () => {
    if (import.meta.env.PROD) {
        // Production: use environment variable or absolute URL
        return import.meta.env.VITE_API_URL || 'https://kaamsetu-api.onrender.com';
    }
    // Development: use proxy path
    return '/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token from localStorage as fallback
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('kaamsetu_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — auto-redirect on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('kaamsetu_token');
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
