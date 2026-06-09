// src/api/doctors.js
import API from "./axiosinstance"; // axios instance with baseURL & token

// Get doctors list (supports filters, grouping, pagination)
export const getDoctors = (params = {}) => API.get("/api/doctors", { params });

// Get single doctor by ID
export const getDoctorById = (id) => API.get(`/api/doctors/${id}`);

// Get nearby doctors
export const getNearbyDoctors = (lat, lng, specialization, page = 1, limit = 10) =>
  API.get("/api/doctors/nearby", { params: { lat, lng, specialization, page, limit } });

// Create a doctor
export const createDoctor = (data) => API.post("/api/doctors", data);

// Update a doctor
export const updateDoctor = (id, data) => API.put(`/api/doctors/${id}`, data);

// Verify a doctor
export const verifyDoctor = (id) => API.post(`/api/doctors/${id}/verify`);

// Seed doctors
export const seedDoctors = () => API.post("/api/doctors/seed");
