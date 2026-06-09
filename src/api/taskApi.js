import API from "./axiosinstance";

export const createTask = (data) =>
  API.post("/api/tasks", data);

export const getUserTasks = () =>
  API.get("/api/tasks/my-tasks");

export const updateTaskStatus = (taskId, status) =>
  API.put(`/api/tasks/${taskId}/status`, { status });

export const deleteTask = (taskId) =>
  API.delete(`/api/tasks/${taskId}`);

export const getFamilyTasks = (familyId) =>
  API.get(`/api/tasks/family/${familyId}`);