// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { FaTasks, FaPills, FaPlus, FaChevronRight, FaUsers, FaCalendarAlt } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import API from "../api/axiosinstance";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import socket from "../../socket/socket";

const Dashboard = () => {
  const { user } = useAuth();
  const [quote, setQuote] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("Morning");
  const [healthLogs, setHealthLogs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [families, setFamilies] = useState([]);
  const [medReminders, setMedReminders] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ false — page turant dikhega
  const navigate = useNavigate();

  const quotes = [
    "Your health is your wealth.",
    "Small daily improvements lead to long-term health.",
    "Take care of your body; it's the only place you have to live.",
  ];

  const fetchDashboardData = async () => {
    try {
      const [familyRes, reminderRes, eventRes, healthRes] = await Promise.all([
        API.get("/api/family/my-families"),
        API.get("/api/reminders"),
        API.get("/api/events/family"),
        API.get("/api/healthlogs/me"),
      ]);

      const fetchedFamilies = familyRes.data || [];
      setFamilies(fetchedFamilies);

      if (healthRes.data.success) setHealthLogs(healthRes.data.logs);

      const userReminders = (reminderRes.data || []).filter(
        r => r.createdBy?._id === user?._id
      );
      setMedReminders(userReminders);

      const userEvents = (eventRes.data || []).filter(
        e => e.createdBy === user?._id
      );
      setEvents(userEvents);

      if (fetchedFamilies.length > 0) {
        const taskResults = await Promise.all(
          fetchedFamilies.map(family =>
            API.get(`/api/tasks/family/${family._id}`)
              .then(res => res.data.tasks || [])
              .catch(() => [])
          )
        );

        const allTasks = taskResults
          .flat()
          .filter(task => {
            const assignedId =
              typeof task.assignedTo === "object"
                ? task.assignedTo?._id
                : task.assignedTo;
            return assignedId === user?._id;
          });

        setTasks(allTasks);
      }

    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("Morning");
    else if (hour < 18) setTimeOfDay("Afternoon");
    else setTimeOfDay("Evening");

    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    if (!user) return;

    // ✅ Page turant dikhega, data background mein load hoga
    fetchDashboardData();
  }, [user]);

  /* =====================================================
     ⚡ REAL-TIME SOCKET
  ===================================================== */
  useEffect(() => {
    if (!user || families.length === 0) return;

    families.forEach(f => socket.emit("joinFamily", f._id));

    const handleTaskCreated = (task) => {
      const assignedId =
        typeof task.assignedTo === "object"
          ? task.assignedTo?._id
          : task.assignedTo;
      if (assignedId === user._id) {
        setTasks(prev => {
          const exists = prev.some(t => t._id === task._id);
          return exists ? prev : [task, ...prev];
        });
      }
    };

    const handleTaskUpdated = (task) => {
      const assignedId =
        typeof task.assignedTo === "object"
          ? task.assignedTo?._id
          : task.assignedTo;
      if (assignedId === user._id) {
        setTasks(prev => prev.map(t => t._id === task._id ? task : t));
      }
    };

    const handleEventCreated = (event) => {
      if (event.createdBy === user._id) {
        setEvents(prev => {
          const exists = prev.some(e => e._id === event._id);
          return exists ? prev : [event, ...prev];
        });
      }
    };

    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("eventCreated", handleEventCreated);

    return () => {
      socket.off("taskCreated", handleTaskCreated);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("eventCreated", handleEventCreated);
    };
  }, [families, user]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const taskCompletionPercent = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const recentPendingTasks = tasks
    .filter((t) => t.status === "Pending")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const formatDateTime = (d) => {
    if (!d) return "N/A";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "Invalid Date";
    return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="dashboard container-fluid">
      {/* HEADER */}
      <header className="dashboard-header-modern mb-5">
        <div className="greeting-content">
          <h2 className="fw-bold text-dark">Good {timeOfDay}</h2>
          <p className="text-muted mb-0">{quote}</p>
        </div>
      </header>

      <div className="row g-4">

        {/* TASK COMPLETION */}
        <div className="col-lg-5">
          <div className="dashboard-section p-4 shadow-sm rounded-4 h-100 d-flex flex-column" style={{ background: '#0f172a' }}>
            <h5 className="section-title mb-4">Task Completion</h5>
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
              <div className="progress-container-outer">
                <div
                  className="circular-progress"
                  style={{ background: `conic-gradient(#3b82f6 ${taskCompletionPercent * 3.6}deg, rgb(36, 36, 36) 0deg)` }}
                >
                  <div className="inner-circle">
                    <h3 className="fw-bold text-primary mb-0" style={{ fontSize: "2.5rem" }}>
                      {taskCompletionPercent}%
                    </h3>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-white small mb-1 fw-medium">{completedTasks} tasks completed</p>
                <span className="badge bg-light text-secondary border rounded-pill px-3 py-2">
                  {totalTasks - completedTasks} tasks remaining
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* HEALTH SUMMARY */}
        <div className="col-lg-7">
          <div className="dashboard-section p-4 shadow-sm rounded-4 h-100" style={{ background: '#0f172a' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h5 className="section-title mb-0">Health Summary</h5>
              <button
                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                onClick={() => navigate("/health-logs")}
              >
                View History
              </button>
            </div>

            <p className="text-white small mb-4">
              Last update: {healthLogs[0] ? new Date(healthLogs[0].date).toLocaleString() : "N/A"}
            </p>

            <div className="row g-3">
              {(() => {
                const v = healthLogs[0]?.vitals || {};
                const metrics = [
                  { label: "Blood Pressure", val: `${v.bloodPressure?.systolic || 0}/${v.bloodPressure?.diastolic || 0}`, unit: "mmHg", color: "#3b82f6", status: v.bloodPressure?.systolic > 130 ? "High" : "Normal" },
                  { label: "Body Weight", val: v.weight || 0, unit: "kg", color: "#10b981", status: "Target" },
                  { label: "Heart Rate", val: v.heartRate || 0, unit: "bpm", color: "#f59e0b", status: v.heartRate > 100 ? "High" : "Stable" },
                  { label: "Blood Sugar", val: v.sugar || 0, unit: "mg/dL", color: "#ef4444", status: v.sugar > 140 ? "High" : "Normal" }
                ];
                return metrics.map((m, i) => (
                  <div key={i} className="col-6">
                    <div className="metric-tile p-3 rounded-4" style={{ background: '#c2e1ff' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="status-dot" style={{ backgroundColor: m.color }}></div>
                        <span className="metric-label">{m.label}</span>
                      </div>
                      <div className="d-flex align-items-baseline gap-1">
                        <h4 className="fw-bold mb-0">{m.val}</h4>
                        <small className="text-muted fw-light">{m.unit}</small>
                      </div>
                      <div className={`status-badge mt-2 ${m.status.toLowerCase()}`}>
                        {m.status}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="mt-4 p-3 rounded-4" style={{ background: '#d8d8d8' }}>
              <label className="d-block small fw-bold text-muted mb-1 text-uppercase" style={{ fontSize: '0.65rem' }}>
                Latest Notes
              </label>
              <p className="small mb-0 text-dark">
                {healthLogs[0]?.notes || "No notes available"}
              </p>
            </div>
          </div>
        </div>

        {/* RECENT TASKS */}
        <div className="col-lg-6">
          <div className="dashboard-section p-4 shadow-sm rounded-4 h-100" style={{ background: '#0f172a' }}>
            <h5 className="section-title mb-4 d-flex justify-content-between">
              Recent Pending Tasks
              <FaTasks className="text-white" size={22} />
            </h5>
            {recentPendingTasks.length === 0 ? (
              <p className="text-center text-white py-4">No pending tasks 🎉</p>
            ) : (
              <div className="task-list">
                {recentPendingTasks.slice(0, 2).map((task) => (
                  <div key={task._id} className="task-item d-flex align-items-center justify-content-between p-3 mb-2 rounded-4" style={{ background: '#d8d8d8' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="task-icon-circle bg-warning-subtle">
                        <FaTasks className="text-warning" />
                      </div>
                      <div>
                        <p className="mb-0 fw-bold text-dark">{task.title}</p>
                        <small className="text-muted">Due: {new Date(task.dueDate).toLocaleDateString()}</small>
                      </div>
                    </div>
                    <span className="badge-warning-custom px-3 py-1 rounded-pill">{task.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FAMILY GROUP */}
        <div className="col-lg-6">
          <div className="dashboard-section p-4 shadow-sm rounded-4 h-100" style={{ background: '#0f172a' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="section-title mb-0">Family Group</h5>
              <button className="btn btn-link btn-sm text-primary text-decoration-none fw-bold p-0" onClick={() => navigate("/family-dashboard")}>
                Manage
              </button>
            </div>
            {families.length === 0 ? (
              <div className="text-center py-3 border-dashed rounded-4">
                <p className="text-white small mb-0">No family groups found</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {families.slice(0, 2).map((fam) => (
                  <div key={fam._id} className="family-item d-flex align-items-center justify-content-between p-3 rounded-4" style={{ background: '#d8d8d8' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="task-icon-circle bg-primary-subtle">
                        <FaUsers className="text-primary" />
                      </div>
                      <div>
                        <p className="mb-0 fw-bold text-dark">{fam.name}</p>
                        <small className="text-muted">{fam.members?.length || 0} Members</small>
                      </div>
                    </div>
                    <FaChevronRight className="text-muted opacity-50" size={12} />
                  </div>
                ))}
                {families.length > 2 && (
                  <div className="text-center mt-2">
                    <small className="text-muted fw-medium">+{families.length - 2} more groups</small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* REMINDERS */}
        <div className="col-lg-6">
          <div className="dashboard-section p-4 shadow-sm rounded-4 h-100" style={{ background: '#0f172a' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="section-title mb-0">Reminders</h5>
              <button className="btn btn-sm btn-light rounded-circle" onClick={() => navigate("/reminders")}>
                <FaPlus size={10} />
              </button>
            </div>
            {medReminders.length === 0 ? (
              <div className="p-3 text-center border-dashed rounded-4">
                <FaPills size={24} className="text-muted mb-2 opacity-50" />
                <p className="text-white small mb-0">No active reminders</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {medReminders
                  .filter(r => !r.isCompleted)
                  .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
                  .slice(0, 3)
                  .map((r) => (
                    <div key={r._id} className="medicine-card d-flex justify-content-between align-items-center p-3 rounded-4 border" style={{ background: '#d8d8d8' }}>
                      <div className="d-flex align-items-center gap-3">
                        <FaPills size={20} />
                        <div>
                          <p className="mb-0 fw-bold">{r.title}</p>
                          <small className="text-muted">{r.description}</small>
                        </div>
                      </div>
                      <span className="text-muted small">{formatDateTime(r.scheduledTime)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* EVENTS */}
        <div className="col-lg-6">
          <div className="dashboard-section p-4 shadow-sm rounded-4 h-100" style={{ background: "#0f172a" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="section-title mb-0">Upcoming Events</h5>
              <button className="btn btn-sm btn-light rounded-circle" onClick={() => navigate("/calendar")}>
                <FaPlus size={10} />
              </button>
            </div>
            {events.length === 0 ? (
              <div className="p-3 text-center border-dashed rounded-4">
                <FaCalendarAlt size={24} className="text-muted mb-2 opacity-50" />
                <p className="text-white small mb-0">No upcoming events</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {events
                  .filter(e => new Date(e.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 3)
                  .map((e) => (
                    <div key={e._id} className="p-3 rounded-4" style={{ background: "#d8d8d8" }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="mb-0 fw-bold">{e.title}</p>
                        <span className="badge bg-primary px-2 py-1">{e.type}</span>
                      </div>
                      <small className="text-muted d-block mt-1">
                        {new Date(e.date).toLocaleDateString()} • {e.time || "All Day"}
                      </small>
                      {e.description && (
                        <small className="text-muted d-block mt-1">{e.description}</small>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
