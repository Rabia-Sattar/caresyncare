import API from "./axiosinstance";

export const getUserNotes = () => API.get("/api/notes");
export const createNote = (data) => API.post("/api/notes", data);
export const updateNote = (id, data) => API.put(`/api/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/api/notes/${id}`);
export const togglePin = (id) => API.patch(`/api/notes/pin/${id}`);
export const searchNotes = (q) => API.get(`/api/notes/search?q=${q}`);
