import React, { useEffect, useState } from "react";
import API from "../api/axiosinstance";
import "./reminder.css";

const Reminders = () => {
  const [families, setFamilies] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledTime: "",
    family: "",
  });

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([fetchUser(), loadFamilies(), fetchReminders()]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const fetchUser = async () => {
    const res = await API.get("/api/auth/me");
    setUser(res.data);
  };

  const loadFamilies = async () => {
    const res = await API.get("/api/family/my-families");
    setFamilies(res.data || []);
    if (res.data?.length === 1) setForm(f => ({ ...f, family: res.data[0]._id }));
  };

  const fetchReminders = async () => {
    const res = await API.get("/api/reminders");
    setReminders(res.data || []);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.scheduledTime || !form.title || !form.family)
      return alert("Title, scheduled time and family are required");

    await API.post("/api/reminders", form);
    await fetchReminders();
    setShowModal(false);
    setForm({ title: "", description: "", scheduledTime: "", family: form.family });
  };

  const completeReminder = async id => {
    await API.patch(`/api/reminders/${id}/complete`);
    fetchReminders();
  };

  const formatDate = d => {
    const date = new Date(d);
    return `${date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  if (loading) return <div className="reminder-container">Loading...</div>;

  return (
    <div className="reminder-container">
<header className="reminder-header">
  <div className="header-left">
    <h1>Reminders</h1>
    {/* <p className="welcome-text"> Welcome <span>{user?.name || "User"}</span> 👋</p> */}
  </div>
  
  <button className="btn-create" onClick={() => setShowModal(true)}>
    <span className="plus-icon">+</span> Create Reminder
  </button>
</header>
    <div className="reminders-main-container">

  <div className="reminders-content">
  {/* Left Column - Pending */}
<div className="reminders-left">
  <h3 className="column-title">Pending Reminders</h3>
  {reminders.filter(r => !r.isCompleted).length === 0 && (
    <p className="empty-msg">No pending reminders 🎉</p>
  )}
  {reminders
    .filter(r => !r.isCompleted)
    .sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime)) // Newest first
    .map(r => (
      <div key={r._id} className="reminder-card">
        <div className="reminder-header">
          <strong>{r.title}</strong>
          <button
            className="btn-complete"
            onClick={() => completeReminder(r._id)}
          >
            Mark Done
          </button>
        </div>
        {r.description && <p className="reminder-desc">{r.description}</p>}
        <div className="reminder-footer">
          <span>{formatDate(r.scheduledTime)}</span>
          <span>{r.family?.name}</span>
          <span>Created by {r.createdBy?.name}</span>
        </div>
      </div>
    ))}
</div>

{/* Right Column - Completed */}
<div className="reminders-right">
  <h3 className="column-title">Completed Reminders</h3>
  {reminders.filter(r => r.isCompleted).length === 0 && (
    <p className="empty-msg">No completed reminders yet.</p>
  )}
  {reminders
    .filter(r => r.isCompleted)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)) // Most recently completed first
    .map(r => (
      <div key={r._id} className="reminder-card completed">
        <div className="reminder-header">
          <strong>{r.title}</strong>
          <span className="completed-info">
            ✅ Done by {r.completedBy?.name} at {formatDate(r.completedAt)}
          </span>
        </div>
        {r.description && <p className="reminder-desc">{r.description}</p>}
        <div className="reminder-footer">
          <span>{formatDate(r.scheduledTime)}</span>
          <span>{r.family?.name}</span>
          <span>Created by {r.createdBy?.name}</span>
        </div>
      </div>
    ))}
</div>

  </div>
</div>


      {showModal && (
  <div className="modal-overlay">
    <div className="modal-container">

      {/* Close Icon */}
      <button
        className="modal-close"
        onClick={() => setShowModal(false)}
      >
        ×
      </button>

      <h3>Create Reminder</h3>

      <form onSubmit={handleSubmit} className="modal-form">
        <input
          name="title"
          placeholder="Reminder Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />

        {/* Separate Date */}
        <input
          type="date"
          name="date"
          onChange={(e) =>
            setForm(f => ({
              ...f,
              scheduledTime: `${e.target.value}T${form.time || "00:00"}`
            }))
          }
          required
        />

        {/* Separate Time */}
        <input
          type="time"
          name="time"
          onChange={(e) =>
            setForm(f => ({
              ...f,
              scheduledTime: `${form.scheduledTime?.split("T")[0] || ""}T${e.target.value}`
            }))
          }
          required
        />

        <select
          name="family"
          value={form.family}
          onChange={handleChange}
          required
        >
          <option value="">Select Family</option>
          {families.map(f => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Reminders;
