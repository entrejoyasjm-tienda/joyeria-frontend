import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",});

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