import React, { useEffect, useState, useMemo, useCallback } from "react";
import API from "../api/axiosinstance";
import Sidebar from "../components/sidebar";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MoreVertical,
  CheckCircle2,
  Plus,
  LayoutGrid,
  Check
} from "lucide-react";
import { Container, Row, Col, Button, Badge, Spinner, Dropdown } from "react-bootstrap";
import "./taskpage.css";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // FIX #1: Track kaun sa task update ho raha hai — UI instantly respond kare
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const fetchUserTasks = useCallback(async () => {
    try {
      const res = await API.get("/api/tasks/my-tasks");
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserTasks();
  }, [fetchUserTasks]);

  // FIX #2: Optimistic update — pehle local state change karo, phir API call
  // Agar API fail ho to rollback karo — refetch band, loading instant
  const updateStatus = useCallback(async (taskId, status) => {
    setUpdatingTaskId(taskId);

    // Purana state save karo rollback ke liye
    const previousTasks = tasks;

    // Optimistic update — turant UI mein dikha do
    setTasks(prev =>
      prev.map(t => t._id === taskId ? { ...t, status } : t)
    );

    try {
      await API.put(`/api/tasks/${taskId}`, { status });
      // Success — kuch karne ki zaroorat nahi, UI already updated hai
    } catch (err) {
      console.error("Error updating task:", err);
      // Rollback agar error aaye
      setTasks(previousTasks);
      alert("Status update failed. Please try again.");
    } finally {
      setUpdatingTaskId(null);
    }
  }, [tasks]);

  // FIX #3: Delete bhi optimistic rakho
  const deleteTask = useCallback(async (taskId) => {
    const previousTasks = tasks;
    setTasks(prev => prev.filter(t => t._id !== taskId));
    try {
      await API.delete(`/api/tasks/${taskId}`);
    } catch (err) {
      console.error("Error deleting task:", err);
      setTasks(previousTasks);
      alert("Delete failed. Please try again.");
    }
  }, [tasks]);

  // useMemo theek hai — sirf recalculate tab ho jab tasks ya searchTerm change ho
  const grouped = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return tasks
      .filter(t => t.title.toLowerCase().includes(term))
      .reduce((acc, task) => {
        const familyName = task.familyId?.name || "Personal Tasks";
        if (!acc[familyName]) acc[familyName] = [];
        acc[familyName].push(task);
        return acc;
      }, {});
  }, [tasks, searchTerm]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed": return "status-completed";
      case "In Progress": return "status-progress";
      default: return "status-pending";
    }
  };

  if (loading) return (
    <div className="task-loading-screen">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="dashboard-main-content" style={{ paddingTop: "60px" }}>
        <Container fluid className="p-4">

          {/* Header */}
          <header className="task-header d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-800 text-dark mb-1">Task Management</h2>
              <p className="text-muted small">Stay organized with your caregiving responsibilities</p>
            </div>
            <Button className="btn-new-task shadow-sm">
              <Plus size={18} className="me-2" /> New Task
            </Button>
          </header>

          {/* Search & Action Bar */}
          <div className="task-action-bar shadow-sm mb-5">
            <div className="search-group">
              <Search size={18} className="text-muted" />
              <input
                type="text"
                placeholder="Search tasks by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="view-toggles d-none d-md-flex gap-2">
              <Button variant="light" className="btn-utility"><Filter size={16} /> Filter</Button>
              <Button variant="light" className="btn-utility"><LayoutGrid size={16} /> Board</Button>
            </div>
          </div>

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <div className="task-empty-state">
              <div className="illustration">📋</div>
              <h4>All clear!</h4>
              <p>You have no tasks assigned at the moment.</p>
            </div>
          ) : (
            Object.keys(grouped).map((familyName) => (
              <section key={familyName} className="family-task-group mb-5">
                <div className="group-header mb-3 d-flex align-items-center gap-3">
                  <h4 className="group-title">{familyName}</h4>
                  <Badge bg="soft-primary" className="task-count-badge">
                    {grouped[familyName].length} {grouped[familyName].length === 1 ? 'Task' : 'Tasks'}
                  </Badge>
                </div>

                <Row className="g-4">
                  {grouped[familyName].map((task) => {
                    const isUpdating = updatingTaskId === task._id;
                    return (
                      <Col key={task._id} xs={12} xl={6}>
                        <div className={`task-card-v2 shadow-sm border-0 h-100 ${isUpdating ? "opacity-75" : ""}`}
                          style={{ transition: "opacity 0.2s" }}>
                          <div className="p-4 d-flex flex-column justify-content-between h-100">
                            <div>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <h5 className="task-name">{task.title}</h5>
                                <Dropdown align="end">
                                  <Dropdown.Toggle as="div" className="more-btn">
                                    <MoreVertical size={18} />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="border-0 shadow-lg">
                                    <Dropdown.Item
                                      disabled={isUpdating || task.status === "In Progress"}
                                      onClick={() => updateStatus(task._id, "In Progress")}
                                    >
                                      Mark In Progress
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      disabled={isUpdating || task.status === "Completed"}
                                      onClick={() => updateStatus(task._id, "Completed")}
                                    >
                                      Mark Completed
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item
                                      className="text-danger"
                                      onClick={() => deleteTask(task._id)}
                                    >
                                      Delete Task
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                              <p className="task-description text-muted mb-4">
                                {task.description || "No description provided for this task."}
                              </p>
                            </div>

                            <div className="task-card-footer d-flex justify-content-between align-items-center">
                              <div className="meta-info d-flex gap-3 align-items-center">
                                <div className="meta-item d-flex align-items-center gap-1">
                                  <Calendar size={14} className="text-primary" />
                                  <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}</span>
                                </div>
                                <div className={`status-pill ${getStatusClass(task.status)}`}>
                                  {task.status === "Completed" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                  {task.status}
                                </div>
                              </div>

                              <div className="quick-actions">
                                {task.status !== "Completed" && (
                                  <button
                                    className="btn-done-modern"
                                    disabled={isUpdating}
                                    onClick={() => updateStatus(task._id, "Completed")}
                                  >
                                    {isUpdating
                                      ? <Spinner size="sm" animation="border" />
                                      : <><Check size={14} /> Done</>
                                    }
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </section>
            ))
          )}
        </Container>
      </main>
    </div>
  );
};

export default TaskPage;
