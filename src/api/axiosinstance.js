import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://caresync-final-year-project-software-engineering-production.up.railway.app",
  // "http://localhost:5000",
  // "https://caresync-care-production.up.railway.app",
  
});

axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);

    if (parsedUser?.token) {
      config.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }

  return config;
});

export default axiosInstance;
