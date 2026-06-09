// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://caresync-care-production.up.railway.app/api",
  timeout: 10000,
});

// attach token on each request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
