// ✅ ONLY NEW IMPORT
import socket from "../../socket/socket";

import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  PlayCircle,
  Trash2,
  Edit2,
} from "lucide-react";
import API from "../api/axiosinstance";
import { updateTaskStatus } from "../api/taskApi";
import "./tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    familyId: "",
    priority: "Medium",
  });

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  // Fetch families and tasks
  const fetchFamiliesAndTasks = async () => {
    try {
      setLoading(true);
      const familyRes = await API.get("/api/family/my-families");
      const fetchedFamilies = familyRes.data || [];
      setFamilies(fetchedFamilies);

      const allTasks = [];
      for (const family of fetchedFamilies) {
        const taskRes = await API.get(`/api/tasks/family/${family._id}`);
        allTasks.push(...(taskRes.data.tasks || []));
      }
      setTasks(allTasks);
    } catch (err) {
      console.error("Failed to fetch families/tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamiliesAndTasks();
  }, []);

  /* =====================================================
     ⚡ SOCKET REAL-TIME SETUP
  ===================================================== */
 useEffect(() => {
  if (families.length === 0) return;

  families.forEach((f) => {
    socket.emit("joinFamily", f._id);
  });

  const handleCreated = (newTask) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t._id === newTask._id);
      return exists ? prev : [newTask, ...prev];
    });
  };

  const handleUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  socket.on("taskCreated", handleCreated);
  socket.on("taskUpdated", handleUpdated);

  return () => {
    socket.off("taskCreated", handleCreated);
    socket.off("taskUpdated", handleUpdated);
  };
}, [families]);

  // Handle create/edit task
const handleSubmitTask = async (e) => {
  e.preventDefault();

  if (!taskData.familyId) {
    return alert("Please select a family.");
  }

  // ✅ CLOSE MODAL IMMEDIATELY (removes lag)
  setShowModal(false);

  // optional: keep UI responsive even during API call
  const payload = { ...taskData };

  try {
    if (editTaskId) {
      await API.put(`/api/tasks/${editTaskId}`, payload);
    } else {
      await API.post("/api/tasks", payload);
    }

    // ✅ reset form AFTER request
    setTaskData({
      title: "",
      description: "",
      dueDate: "",
      familyId: "",
      priority: "Medium",
    });

    setEditTaskId(null);

  } catch (err) {
    console.error("Task creation/update failed:", err);

    // ⚠️ if API fails, optionally reopen modal so user doesn’t lose context
    setShowModal(true);

    alert(err.response?.data?.message || "Failed to create/update task");
  }
};
  // Delete task (keep fetch)
  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/api/tasks/${id}`);
      fetchFamiliesAndTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };

  // Edit task (FIXED familyId mapping)
  const handleEditTask = (task) => {
    setEditTaskId(task._id);
    setTaskData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.split("T")[0] || "",
      familyId: task.family || task.familyId,
      priority: task.priority || "Medium",
    });
    setShowModal(true);
  };

  // Update task status (no fetch)
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
    } catch (err) {
      console.error(err);
      alert("Failed to update task status");
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const columns = [
    { title: "Pending", status: "Pending", icon: <Clock size={16} /> },
    { title: "In Progress", status: "In Progress", icon: <PlayCircle size={16} /> },
    { title: "Completed", status: "Completed", icon: <CheckCircle2 size={16} /> },
  ];

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 fw-600">Loading Task Board...</p>
      </div>
    );
  }

  return (
    <div className="task-dashboard">
      {/* HEADER */}
      <div className="task-header">
        <div>
          <h2>Task Board</h2>
          <p>Track and manage caregiving tasks</p>
        </div>
        <button className="btn-new-task" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* SEARCH */}
      <div className="task-action-bar">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-filter">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      {/* KANBAN */}
      <div className="kanban-board">
        {columns.map((col) => (
          <div
            className={`kanban-column column-${col.status.replace(" ", "").toLowerCase()}`}
            key={col.status}
          >
            <div className="kanban-header">{col.icon} {col.title}</div>

            {filteredTasks
              .filter((t) => t.status === col.status)
              .map((task) => {
                const family = families.find(
                  (f) => f._id === (task.family || task.familyId)
                );

                const assignedId =
                  typeof task.assignedTo === "object"
                    ? task.assignedTo?._id
                    : task.assignedTo;

                const isAssigned = assignedId === userId;
                const isAdmin = family?.createdBy?._id === userId;

                return (
                  <div
                    className={`task-card status-${task.status.replace(" ", "").toLowerCase()}`}
                    key={task._id}
                  >
                    {isAdmin && (
                      <div className="admin-actions">
                        <button
                          className="icon-btn edit"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}

                    <h6>{task.title}</h6>
                    <p>{task.description || "No description"}</p>

                    <p className="task-priority">
                      Priority: <strong>{task.priority || "Medium"}</strong>
                    </p>

                    <p className="assigned-user">
                      Assigned to{" "}
                      <strong>{task.assignedTo?.name || "AI Assigned"}</strong>
                    </p>

                    {/* 🤖 AI Reason */}
                    {task.aiExplanation?.message && (
                      <p className="assigned-user">
                        🤖 {task.aiExplanation.message}
                      </p>
                    )}

                    <div className="task-footer">
                      <span>
                        <Calendar size={12} />
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No date"}
                      </span>

                      {isAssigned && task.status !== "Completed" && (
                        <div className="status-buttons">
                          {task.status === "Pending" && (
                            <button
                              className="btn-status processing"
                              onClick={() =>
                                handleUpdateStatus(task._id, "In Progress")
                              }
                            >
                              Processing
                            </button>
                          )}
                          <button
                            className="btn-status completed"
                            onClick={() =>
                              handleUpdateStatus(task._id, "Completed")
                            }
                          >
                            Completed
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {/* MODAL (UNCHANGED UI) */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="task-modal-content">
            <div className="task-modal-header">
              <h4>{editTaskId ? "Edit Task" : "Create Task"}</h4>
              <button className="icon-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitTask} className="task-modal-body">
              <input
                className="modal-input"
                placeholder="Task Title"
                required
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              />

              <textarea
                className="modal-input"
                rows="2"
                placeholder="Description"
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              />

              <div className="modal-row">
                <select
                  className="modal-input"
                  required
                  value={taskData.familyId}
                  onChange={(e) => setTaskData({ ...taskData, familyId: e.target.value })}
                >
                  <option value="">Select Family</option>
                  {families.map((f) => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <input
                type="date"
                className="modal-input"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
              />

              <select
                className="modal-input"
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-create-submit">
                  {editTaskId ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;