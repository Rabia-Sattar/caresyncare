import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import API from "../api/axiosinstance";
import 'react-calendar/dist/calendar.css';
import { parseISO, isSameDay } from "date-fns";
import { FaTasks, FaClipboardList } from "react-icons/fa"; // Import icons

const FamilyCalendar = ({ familyId }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch and map tasks
                const taskRes = await API.get(`/api/tasks/${familyId}`);
                const taskEvents = taskRes.data.tasks
                    .filter(t => t.status !== "Completed" && t.dueDate) // Only show incomplete tasks with a due date
                    .map(t => ({
                        id: t._id,
                        title: t.title,
                        dueDate: t.dueDate,
                        type: 'Task'
                    }));

                setEvents([...taskEvents]); 
            } catch (err) {
                console.error("Error fetching calendar events", err);
            }
        };
        fetchEvents();
    }, [familyId]);

    const tileContent = ({ date, view }) => {
        if (view === "month") {
            const dayEvents = events.filter(
                e => e.dueDate && isSameDay(parseISO(e.dueDate), date)
            );

            return dayEvents.length > 0 ? (
                <div className="calendar-event-indicators">
                    {/* Render a dot for each event type present */}
                    {dayEvents.find(e => e.type === 'Task') && <span className="event-dot task-dot"></span>}
                    {/* Add more event dots here for other types like Appointment or Medicine */}
                </div>
            ) : null;
        }
        return null;
    };
    
    // Custom function to apply classes to the tile itself (for visual highlight)
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const hasEvent = events.some(
                e => e.dueDate && isSameDay(parseISO(e.dueDate), date)
            );
            return hasEvent ? 'has-event-marker' : null;
        }
        return null;
    };

    const formatShortDay = (locale, date) => date.toString().slice(0, 3).toUpperCase();


    return (
        <div className="family-calendar-wrapper" style={{background:'#e9f3fd'}}>
            <Calendar 
                tileContent={tileContent}
                tileClassName={tileClassName}
                // Prevents accidental view switching
                maxDetail="month"
                minDetail="month"
                // Custom day label format (MON, TUE, etc.)
                formatShortWeekday={formatShortDay}
            />
        </div>
    );
};

export default FamilyCalendar;