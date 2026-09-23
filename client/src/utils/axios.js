import axios from 'axios';

const api = axios.create({
    // Relative base URL works for both:
    // - Local dev: Vite proxy forwards /api → http://localhost:5000/api
    // - Production (Render): Express serves client + handles /api/* routes on same domain
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;