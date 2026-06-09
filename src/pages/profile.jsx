import React, { useEffect, useState } from "react";
import API from "../api/axiosinstance";
import useAuth from "../hooks/useAuth";
import "./profile.css";

const Profile = () => {
  const { user = {}, setUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const { data } = await API.get("/api/tasks/my-tasks");
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newAvailability = !user?.isAvailable;
      const { data } = await API.put("/api/users/availability", {
        isAvailable: newAvailability,
      });

      const updatedUser = { ...user, isAvailable: data.isAvailable };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update availability:", error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const activeTasks = tasks.filter(t => ["Pending", "In Progress"].includes(t.status)).length;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  if (loading) return <div className="profile-wrapper"><div className="loader"></div></div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        
        {/* Profile Header */}
        <header className="profile-header" >
          <div className="avatar-container">
            <div className="avatar-glow"></div>
            <div className="avatar-main">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
          <div className="header-text">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </header>

        {/* Status Toggle Card */}
        <div className={`status-card ${user?.isAvailable ? "is-online" : "is-offline"}`}>
          <div className="status-info">
            <span className="status-label">Current Status</span>
            <div className="status-indicator">
              <span className="dot"></span>
              {user?.isAvailable ? "Available " : "Unavailable"}
            </div>
          </div>
          <button onClick={toggleAvailability} className="action-button">
            {user?.isAvailable ? "Go Offline" : "Go Online"}
          </button>
        </div>

        {/* Productivity Grid */}
        <section className="productivity-section">
          <h3>Task Productivity Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{totalTasks}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{activeTasks}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{completedTasks}</span>
              <span className="stat-label">Done</span>
            </div>
            <div className="stat-item highlight">
              <span className="stat-value">{completionRate}%</span>
              <span className="stat-label">Rate</span>
            </div>
          </div>

          <div className="progress-wrapper">
             <div className="progress-track">
                <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Profile;