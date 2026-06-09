import React, { useState, useEffect } from "react";
import { FaTimes, FaCalendarAlt, FaClock, FaAlignLeft, FaUsers } from "react-icons/fa";
import API from "../api/axiosinstance";
import "./eventmodal.css"; // See CSS below

const EventModal = ({ isOpen, onClose, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "Appointment",
    date: new Date().toISOString().slice(0, 10),
    time: "12:00",
    isAllDay: false,
    description: "",
  });

  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const fetchFamilies = async () => {
      try {
        const res = await API.get("/api/family/my-families");
        const familyList = res.data || [];
        setFamilies(familyList);
        if (familyList.length === 1) setSelectedFamily(familyList[0]._id);
        else setSelectedFamily("");
      } catch (err) {
        console.error("Failed to fetch families:", err);
      }
    };
    fetchFamilies();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFamily) {
      alert("Please select a family for this event.");
      return;
    }
    try {
      const payload = {
        ...formData,
        date: new Date(`${formData.date}T${formData.time}`),
        familyId: selectedFamily,
      };
      const res = await API.post("/api/events/create", payload);
      onEventCreated(res.data);
      onClose();
      setFormData({
        title: "", type: "Appointment", date: new Date().toISOString().slice(0, 10),
        time: "12:00", isAllDay: false, description: "",
      });
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modern-modal-overlay" onClick={onClose}>
      <div className="modern-modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modern-modal-header">
          <div>
            <h2 style={{color:'white'}}>Create New Event</h2>
            <p>Schedule a new activity for your group</p>
          </div>
          <button className="close-icon-btn" onClick={onClose}><FaTimes /></button>
        </header>

        <form onSubmit={handleSubmit} className="modern-form">
          <div className="modern-modal-body">
            {/* Event Title */}
            <div className="input-section">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                className="main-title-input"
                value={formData.title}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            {/* Event Type & Family Select */}
            <div className="grid-row">
              <div className="input-group">
                <label><FaCalendarAlt /> Event Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="Appointment">Appointment</option>
                  <option value="Medication">Medication</option>
                 
                </select>
              </div>

              {families.length > 1 ? (
                <div className="input-group">
                  <label><FaUsers /> Family</label>
                  <select 
                    value={selectedFamily} 
                    onChange={e => setSelectedFamily(e.target.value)} 
                    required
                  >
                    <option value="">Select Family</option>
                    {families.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                  </select>
                </div>
              ) : (
                <div className="single-family-badge">
                   <FaUsers /> {families[0]?.name || "Family Group"}
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid-row">
              <div className="input-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{background: '#e1e8fd'}}/>
              </div>
              <div className={`input-group ${formData.isAllDay ? 'disabled' : ''}`}>
                <label><FaClock /> Time</label>
                <input 
                  type="time" 
                  name="time" 
                  value={formData.time} 
                  onChange={handleChange} 
                  disabled={formData.isAllDay} 
                  style={{background: '#e1e8fd'}}
                />
              </div>
            </div>

            {/* All Day Toggle */}
            <div className="modern-toggle-container">
              <label className="modern-switch">
                <input type="checkbox" name="isAllDay" checked={formData.isAllDay} onChange={handleChange} />
                <span className="modern-slider"></span>
              </label>
              <span style={{color:'grey'}}>All-day event</span>
            </div>

            {/* Description */}
            <div className="input-group">
              <label><FaAlignLeft /> Description</label>
              <textarea
                name="description"
                placeholder="Add more details..."
                rows="3"
                value={formData.description}
                onChange={handleChange}
                style={{background: '#e1e8fd'}}
              />
            </div>
          </div>

          <footer className="modern-modal-footer">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn">Create Event</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default EventModal;