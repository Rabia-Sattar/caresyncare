import API from "../api/axiosinstance";

// Create Task (AI auto assign)
export const createTask = (data) => API.post("api/tasks", data);

// Get my tasks
export const getMyTasks = () => API.get("api/tasks/my-tasks");

// Get family tasks
export const getFamilyTasks = () => API.get("api/tasks/family");

// Update task status
export const updateTaskStatus = (taskId, status) =>
  API.put(`api/tasks/${taskId}/status`, { status });

// Edit task
export const updateTask = (taskId, data) =>
  API.put(`api/tasks/${taskId}/edit`, data);

// Delete task
export const deleteTask = (taskId) =>
  API.delete(`api/tasks/${taskId}`);