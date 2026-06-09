// ✅ NEW IMPORT (ADDED ONLY)
import socket from "../../socket/socket";

import React, { useState, useEffect } from "react";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  isSameMonth, isSameDay, addMonths, subMonths
} from "date-fns";
import { FaAngleLeft, FaAngleRight, FaPlus } from "react-icons/fa";
import API from "../api/axiosinstance";
import EventModal from "../components/eventmodal";
import useAuth from "../hooks/useAuth";
import "./calendar.css";

const EVENT_TYPES = {
  APPOINTMENT: { color: "blue", label: "Appointment" },
  MEDICATION: { color: "purple", label: "Medication" },
  TASK: { color: "orange", label: "Task" },
  REMINDER: { color: "green", label: "Reminder" },
};

const Calendar = () => {
  const { user } = useAuth();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [families, setFamilies] = useState([]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const fetchEvents = async () => {
    try {
      const res = await API.get("api/events/family");

      const enrichedEvents = res.data.map(ev => ({
        ...ev,
        date: new Date(ev.date),
        createdByName: ev.createdByName || ev.createdBy?.name || "Unknown"
      }));

      setEvents(enrichedEvents);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const familyRes = await API.get("/api/family/my-families");
      const fetchedFamilies = familyRes.data || [];
      setFamilies(fetchedFamilies);

      let allTasks = [];

      for (const family of fetchedFamilies) {
        const res = await API.get(`/api/tasks/family/${family._id}`);

        const enrichedTasks = (res.data.tasks || []).map(task => ({
          ...task,
          createdByName:
            task.createdBy?.name ||
            (task.assignedTo?.name) ||
            "You"
        }));

        allTasks.push(...enrichedTasks);
      }

      setTasks(allTasks);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchTasks();
  }, []);

  /* =====================================================
     ⚡ REAL-TIME SOCKET (UNCHANGED)
  ===================================================== */
  useEffect(() => {
    if (families.length === 0) return;

    families.forEach((f) => {
      socket.emit("joinFamily", f._id);
    });

    const handleTaskCreated = (task) => {
      const enrichedTask = {
        ...task,
        createdByName:
          task.createdBy?.name ||
          task.assignedTo?.name ||
          "You"
      };

      setTasks((prev) => {
        const exists = prev.some((t) => t._id === task._id);
        return exists ? prev : [enrichedTask, ...prev];
      });
    };

    const handleTaskUpdated = (updatedTask) => {
      const enrichedTask = {
        ...updatedTask,
        createdByName:
          updatedTask.createdBy?.name ||
          updatedTask.assignedTo?.name ||
          "You"
      };

      setTasks((prev) =>
        prev.map((t) => (t._id === enrichedTask._id ? enrichedTask : t))
      );
    };

    const handleEventCreatedSocket = (event) => {
      setEvents((prev) => [
        ...prev,
        {
          ...event,
          date: new Date(event.date),
          createdByName:
            event.createdByName || event.createdBy?.name || "Unknown"
        }
      ]);
    };

    const handleEventDeleted = (eventId) => {
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    };

    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("eventCreated", handleEventCreatedSocket);
    socket.on("eventDeleted", handleEventDeleted);

    return () => {
      socket.off("taskCreated", handleTaskCreated);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("eventCreated", handleEventCreatedSocket);
      socket.off("eventDeleted", handleEventDeleted);
    };
  }, [families]);

  const handleEventCreated = (event) => {
    setEvents(prev => [
      ...prev,
      {
        ...event,
        date: new Date(event.date),
        createdByName:
          event.createdByName || event.createdBy?.name || "Unknown"
      }
    ]);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await API.delete(`api/events/${eventId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const taskEvents = tasks.map(task => ({
    _id: task._id,
    title: task.title,
    date: new Date(task.dueDate),
    type: "TASK",
    description: task.description,
    createdBy: task.createdBy,
    createdByName: task.createdByName // ✅ FIX HERE
  }));

  const allItems = [...events, ...taskEvents];

  const eventsForDay = (day) =>
    allItems.filter(ev => isSameDay(new Date(ev.date), day));

  return (
    <div className="calendar-app-wrapper">
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={handleEventCreated}
      />

      <header className="app-top-header">
        <div className="header-text">
          <h1>Shared Calendar</h1>
          <p>View all appointments, tasks, and medication schedules</p>
        </div>
        <button className="add-event-btn" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Add Event
        </button>
      </header>

      <div className="calendar-main-layout">
        <section className="calendar-card">
          <header className="calendar-header">
            <h2 className="month-display" style={{ color: 'white' }}>
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div className="header-nav">
              <button className="nav-btn" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <FaAngleLeft />
              </button>
              <button className="today-btn" onClick={() => setCurrentMonth(new Date())}>
                Today
              </button>
              <button className="nav-btn" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <FaAngleRight />
              </button>
            </div>
          </header>

          <div className="calendar-grid">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="weekday-header">{d}</div>
            ))}

            {days.map((day, idx) => (
              <div
                key={idx}
                className={`day-cell ${!isSameMonth(day, currentMonth) ? "inactive" : ""}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`day-inner ${isSameDay(day, selectedDate) ? "selected" : ""}`}>
                  <span className={`date-label ${isSameDay(day, new Date()) ? "today-highlight" : ""}`}>
                    {format(day, "d")}
                  </span>

                  <div className="cell-events">
                    {eventsForDay(day).map(ev => (
                      <div
                        key={ev._id}
                        className={`event-pill bg-${EVENT_TYPES[ev.type?.toUpperCase()]?.color || "gray"}`}
                      >
                        <span className="event-title">{ev.title}</span>

                        {ev.createdBy === user?._id && ev.type !== "TASK" && (
                          <span
                            className="delete-event"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteEvent(ev._id);
                            }}
                          >
                            &times;
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SIDEBAR */}
        <aside className="calendar-sidebar">
          <div className="side-card">
            <h5 className="agenda-title">{format(selectedDate, "eeee, MMM d")}</h5>
            {eventsForDay(selectedDate).map(ev => (
              <div key={ev._id} className={`agenda-item border-${EVENT_TYPES[ev.type.toUpperCase()]?.color || "gray"}`}>
                <span className={`type-label text-${EVENT_TYPES[ev.type.toUpperCase()]?.color || "gray"}`}>
                  {ev.type} · {ev.isAllDay ? "All Day" : ev.time}
                </span>
                <h6>{ev.title}</h6>
                <p>{ev.description}</p>
                <p className="event-creator">Created by: {ev.createdByName}</p>
              </div>
            ))}
          </div>

          <div className="side-card">
            <label className="sidebar-label">LEGEND</label>
            {Object.entries(EVENT_TYPES).map(([key, value]) => (
              <div key={key} className="legend-item">
                <span className={`dot bg-${value.color}`} />
                {value.label}
              </div>
            ))}
          </div>

          <div className="side-card">
            <h5 className="agenda-title">Upcoming Events</h5>
            {events
              .filter(ev => new Date(ev.date) >= new Date())
              .sort((a,b) => new Date(a.date) - new Date(b.date))
              .map(ev => (
                <div key={ev._id} className={`agenda-item border-${EVENT_TYPES[ev.type.toUpperCase()]?.color || "gray"}`}>
                  <span className={`type-label text-${EVENT_TYPES[ev.type.toUpperCase()]?.color || "gray"}`}>
                    {ev.type} · {ev.isAllDay ? "All Day" : ev.time} · {format(new Date(ev.date), "MMM d, yyyy")}
                  </span>
                  <h6>{ev.title}</h6>
                  <p>{ev.description}</p>
                  <p className="event-creator">Created by: {ev.createdByName}</p>
                </div>
              ))}
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="pro-tips-grid">
        <div className="tip-card " style={{background:"#fac89fde"}}>
          <div className="icon-wrapper"><FaPlus className="icon-orange" /></div>
          <div>
            <strong>Add Reminders</strong>
            <p>Set alerts so you never miss medications.</p>
          </div>
        </div>
        <div className="tip-card bg-green-soft" style={{background:"#9ffacfde"}}>
          <div className="icon-wrapper"><FaPlus className="icon-green" /></div>
          <div>
            <strong>Collaborate</strong>
            <p>Invite caregivers or family members.</p>
          </div>
        </div>
        <div className="tip-card bg-purple-soft" style={{background:"#b3aef8de"}}>
          <div className="icon-wrapper"><FaPlus className="icon-purple" /></div>
          <div>
            <strong>Smart Tagging</strong>
            <p>Use #health or #work for quick filtering.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Calendar;