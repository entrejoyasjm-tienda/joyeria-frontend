import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://joyeria-backend-smkb.onrender.com/api',
});

// Este interceptor revisa si hay un token guardado en el navegador y lo envía en los headers
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;