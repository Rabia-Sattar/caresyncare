import React, { useEffect, useState } from "react";
import API from "../api/axiosinstance";
import { LuBell, LuClock, LuTriangleAlert, LuCircleCheck, LuLightbulb, LuCalendarClock, LuZap } from "react-icons/lu";
import { Spinner } from "react-bootstrap";

const adherenceColors = { Good: "#22c55e", Fair: "#f59e0b", Poor: "#ef4444" };

// Parse a suggestion like "Morning (7:00 AM) to establish..." → title + scheduledTime
const parseSuggestionToReminder = (suggestion, familyId) => {
  const timeMatch = suggestion.match(/\((\d{1,2}:\d{2}\s?[AP]M)\)/i);
  const now = new Date();

  // Default: tomorrow at 8 AM
  let scheduledDate = new Date(now);
  scheduledDate.setDate(scheduledDate.getDate() + 1);
  scheduledDate.setHours(8, 0, 0, 0);

  if (timeMatch) {
    const [hourStr, minuteStr, period] = timeMatch[1]
      .replace(" ", "")
      .match(/(\d{1,2}):(\d{2})(AM|PM)/i)
      .slice(1);
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (period.toUpperCase() === "AM" && hour === 12) hour = 0;

    scheduledDate = new Date(now);
    scheduledDate.setDate(scheduledDate.getDate() + 1);
    scheduledDate.setHours(hour, minute, 0, 0);
  }

  // Short title from the suggestion text
  const title = suggestion.length > 60 ? suggestion.substring(0, 57) + "..." : suggestion;

  return {
    title: "💊 " + title,
    description: "Auto-created by Smart Reminder AI",
    scheduledTime: scheduledDate.toISOString(),
    family: familyId,
  };
};

export default function SmartReminders() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState("");
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    API.get("/api/ai/smart-reminders")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load smart reminder suggestions."))
      .finally(() => setLoading(false));

    API.get("/api/family/my-families")
      .then((res) => {
        setFamilies(res.data || []);
        if (res.data?.length === 1) setSelectedFamily(res.data[0]._id);
      })
      .catch(() => {});
  }, []);

  const handleApplySmartReminders = async () => {
    if (!selectedFamily) {
      setApplyError("Please select a family first.");
      return;
    }

    const timesToApply = data?.bestReminderTimes || [];
    if (timesToApply.length === 0) {
      setApplyError("No suggestions available to apply.");
      return;
    }

    setApplying(true);
    setApplySuccess("");
    setApplyError("");

    try {
      const promises = timesToApply.map((suggestion) => {
        const reminder = parseSuggestionToReminder(suggestion, selectedFamily);
        return API.post("/api/reminders", reminder);
      });

      await Promise.all(promises);
      setApplySuccess(
        `✅ ${timesToApply.length} Smart Reminders saved to your Reminders page!`
      );
    } catch (err) {
      setApplyError("Some reminders could not be saved. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="grow" variant="primary" />
      </div>
    );
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  const adherenceColor = adherenceColors[data?.overallAdherence] || "#94a3b8";

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white", padding: "1.5rem" }}>
      <div className="mb-4">
        <h2 className="fw-bold">💊 Smart Medicine Reminders</h2>
        <p style={{ color: "#94a3b8" }}>AI-powered reminder insights based on your health history</p>
      </div>

      {/* Adherence Score */}
      <div
        className="p-4 rounded-3 mb-4 d-flex align-items-center gap-4"
        style={{ background: "#1e293b" }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: `${adherenceColor}22`,
            border: `3px solid ${adherenceColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "1.8rem" }}>
            {data?.overallAdherence === "Good"
              ? "🌟"
              : data?.overallAdherence === "Fair"
              ? "⚠️"
              : "😟"}
          </span>
        </div>
        <div>
          <div style={{ color: adherenceColor, fontWeight: 700, fontSize: "1.1rem" }}>
            Adherence: {data?.overallAdherence || "Unknown"}
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: 0 }}>
            {data?.totalReminders || 0} total reminders • {data?.missedCount || 0} missed
          </p>
        </div>
      </div>

      {/* Missed Reminders Alert */}
      {data?.missedReminders?.length > 0 && (
        <div
          className="p-3 rounded-3 mb-4"
          style={{ background: "#fef2f222", border: "1px solid #ef4444" }}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <LuTriangleAlert size={18} style={{ color: "#ef4444" }} />
            <span style={{ color: "#ef4444", fontWeight: 600 }}>Missed Reminders</span>
          </div>
          {data.missedReminders.map((r, i) => (
            <div
              key={i}
              className="d-flex justify-content-between align-items-center py-1"
              style={{ borderBottom: "1px solid #334155" }}
            >
              <span style={{ color: "#fca5a5", fontSize: "0.85rem" }}>💊 {r.title}</span>
              <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>⏰ {r.overdueSince} ago</span>
            </div>
          ))}
        </div>
      )}

      {/* AI Insights */}
      <div className="p-3 rounded-3 mb-4" style={{ background: "#1e293b" }}>
        <h6 className="fw-bold mb-3" style={{ color: "#7dd3fc" }}>🤖 AI Insights</h6>
        {data?.insights?.map((insight, i) => (
          <div key={i} className="d-flex gap-2 mb-2">
            <LuLightbulb size={16} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 2 }} />
            <span style={{ color: "#e2e8f0", fontSize: "0.875rem" }}>{insight}</span>
          </div>
        ))}
      </div>

      {/* Best Times + Auto-Apply Section */}
      <div className="p-3 rounded-3 mb-4" style={{ background: "#1e293b" }}>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h6 className="fw-bold mb-0" style={{ color: "#7dd3fc" }}>⏰ Best Reminder Times</h6>
          <span
            style={{
              background: "#1e40af22",
              border: "1px solid #3b82f6",
              color: "#93c5fd",
              fontSize: "0.75rem",
              padding: "2px 10px",
              borderRadius: "999px",
            }}
          >
            AI Suggested
          </span>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {data?.bestReminderTimes?.map((time, i) => (
            <div
              key={i}
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
              style={{ background: "#0f172a", border: "1px solid #3b82f6" }}
            >
              <LuClock size={14} style={{ color: "#3b82f6" }} />
              <span style={{ color: "#93c5fd", fontSize: "0.85rem" }}>{time}</span>
            </div>
          ))}
        </div>

        {/* ✅ AUTO-APPLY SECTION */}
        <div
          className="p-3 rounded-3"
          style={{ background: "#0f172a", border: "1px solid #22c55e33" }}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <LuZap size={16} style={{ color: "#22c55e" }} />
            <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "0.9rem" }}>
              Auto-Save to Reminders
            </span>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
            Click this button to automatically save AI-suggested reminder times to your Reminders page. No manual entry needed!
          </p>

          {families.length > 1 && (
            <select
              className="form-select mb-3"
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              style={{
                background: "#1e293b",
                color: "white",
                border: "1px solid #334155",
                fontSize: "0.85rem",
              }}
            >
              <option value="">-- Select Your Family --</option>
              {families.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          )}

          {applySuccess && (
            <div
              className="p-2 rounded-2 mb-2 d-flex align-items-center gap-2"
              style={{ background: "#22c55e22", border: "1px solid #22c55e", fontSize: "0.85rem" }}
            >
              <LuCircleCheck size={16} style={{ color: "#22c55e" }} />
              <span style={{ color: "#86efac" }}>{applySuccess}</span>
            </div>
          )}

          {applyError && (
            <div
              className="p-2 rounded-2 mb-2"
              style={{ background: "#ef444422", border: "1px solid #ef4444", fontSize: "0.85rem", color: "#fca5a5" }}
            >
              {applyError}
            </div>
          )}

          <button
            onClick={handleApplySmartReminders}
            disabled={applying || !!applySuccess}
            style={{
              background: applySuccess ? "#166534" : "linear-gradient(135deg, #16a34a, #15803d)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: applying || applySuccess ? "not-allowed" : "pointer",
              opacity: applying || applySuccess ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {applying ? (
              <>
                <Spinner animation="border" size="sm" /> Saving...
              </>
            ) : applySuccess ? (
              <>✅ Reminders Saved!</>
            ) : (
              <>
                <LuZap size={16} /> Apply Smart Reminders
              </>
            )}
          </button>
        </div>
      </div>

      {/* Health-based Suggestions */}
      <div className="p-3 rounded-3" style={{ background: "#1e293b" }}>
        <h6 className="fw-bold mb-3" style={{ color: "#7dd3fc" }}>🩺 Health-Based Suggestions</h6>
        {data?.healthBasedSuggestions?.map((sug, i) => (
          <div key={i} className="d-flex gap-2 mb-2">
            <LuCircleCheck size={16} style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }} />
            <span style={{ color: "#e2e8f0", fontSize: "0.875rem" }}>{sug}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
