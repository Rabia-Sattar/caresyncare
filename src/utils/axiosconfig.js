// src/utils/axiosConfig.js
import axios from "axios";

const token = localStorage.getItem("token"); // your login stores JWT here
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// optional: set baseURL if your backend is on another host
// axios.defaults.baseURL = process.env.REACT_APP_API_URL || "";
export default axios;
