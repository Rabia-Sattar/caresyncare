// src/layouts/DashboardLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Bell, AlertTriangle, CheckCheck, X, Trash2 } from "lucide-react";
import axiosInstance from "../api/axiosinstance";
import Sidebar from "../components/sidebar";
import "./dashboardlayout.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleSidebar = () => setCollapsed(!collapsed);

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get("/api/emergency/notifications");
      setNotifications(data.emergencies || []);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const markAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await axiosInstance.put(`/api/emergency/read/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(
        (n) => !n.readBy?.map(String).includes(String(user?._id))
      );
      await Promise.all(
        unread.map((n) => axiosInstance.put(`/api/emergency/read/${n._id}`))
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  };

  // 🗑️ Delete single alert
  const deleteAlert = async (id, e) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this alert?");
    if (!confirmed) return;
    try {
      await axiosInstance.delete(`/api/emergency/delete/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting alert", error);
      alert("You can only delete alerts that you sent.");
    }
  };

  // 🗑️ Clear all — sirf apne bheje hue
  const clearAllMyAlerts = async () => {
    try {
      const mine = notifications.filter(
        (n) => n.sender?._id?.toString() === String(user?._id)
      );
      await Promise.all(
        mine.map((n) => axiosInstance.delete(`/api/emergency/delete/${n._id}`))
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error clearing alerts", error);
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.readBy?.map(String).includes(String(user?._id))
  ).length;

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const myAlertsCount = notifications.filter(
    (n) => n.sender?._id?.toString() === String(user?._id)
  ).length;

  return (
    <div className="dashboard-container">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <div className={`dashboard-content ${collapsed ? "collapsed" : ""}`}>
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <h2>Welcome, {user?.name || "User"} 👋</h2>
          </div>

          <div className="topbar-right">
            <div className="notification-wrapper" ref={dropdownRef}>
              <button
                className={`bell-btn ${unreadCount > 0 ? "has-alerts" : ""}`}
                onClick={toggleDropdown}
                aria-label="Emergency Alerts"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="notification-dropdown">
                  {/* Header */}
                  <div className="notif-header">
                    <div className="notif-title-row">
                      <AlertTriangle size={16} className="notif-title-icon" />
                      <span className="notif-title">Emergency Alerts</span>
                      {unreadCount > 0 && (
                        <span className="notif-count-chip">{unreadCount} new</span>
                      )}
                    </div>
                    <div className="notif-header-actions">
                      {unreadCount > 0 && (
                        <button className="mark-all-btn" onClick={markAllAsRead}>
                          <CheckCheck size={13} />
                          Mark all read
                        </button>
                      )}
                      {myAlertsCount > 0 && (
                        <button className="clear-all-btn" onClick={clearAllMyAlerts}>
                          <Trash2 size={13} />
                          Clear mine
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List */}
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <Bell size={32} opacity={0.3} />
                        <p>No emergency alerts</p>
                        <span>You're all clear!</span>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const isUnread = !n.readBy?.map(String).includes(String(user?._id));
                        const isMine = n.sender?._id?.toString() === String(user?._id);

                        return (
                          <div
                            key={n._id}
                            className={`notification-item ${isUnread ? "unread" : ""}`}
                          >
                            <div className="notif-indicator" />

                            <div
                              className="notif-avatar"
                              style={{
                                background: isMine
                                  ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                                  : "linear-gradient(135deg, #ef4444, #b91c1c)",
                              }}
                            >
                              {n.sender?.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>

                            <div className="notif-content">
                              <div className="notif-sender">
                                {isMine ? "📤" : "🚨"}{" "}
                                {isMine ? "You (sent)" : n.sender?.name || "Family Member"}
                                {isUnread && <span className="unread-dot" />}
                              </div>
                              <div className="notif-message">{n.message}</div>
                              <div className="notif-time">{formatTime(n.createdAt)}</div>
                            </div>

                            {/* Action buttons */}
                            <div className="notif-actions">
                              {isUnread && (
                                <button
                                  className="notif-read-btn"
                                  onClick={(e) => markAsRead(n._id, e)}
                                  title="Mark as read"
                                >
                                  <CheckCheck size={12} />
                                </button>
                              )}
                              {isMine && (
                                <button
                                  className="notif-delete-btn"
                                  onClick={(e) => deleteAlert(n._id, e)}
                                  title="Delete alert"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="notif-footer">
                      {notifications.length} total alert{notifications.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}