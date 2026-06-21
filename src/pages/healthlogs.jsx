// frontend/src/pages/HealthLogs.jsx
import React, { useEffect, useState, useRef } from "react";
import API from "../api/axiosInstance";
import WeeklyVitalsChart from "../components/WeeklyVitalsChart";
import {LuActivity, LuHeart, LuDroplets, LuScale, LuStickyNote, LuUsers,LuClock, LuUser, LuMessageSquare, LuChevronRight, LuCircleAlert,
LuCircleCheck, LuFootprints, LuMoon, LuWind, LuSparkles, LuBrainCircuit, LuTriangleAlert, LuInfo, LuLightbulb } from "react-icons/lu";
import { Spinner, Modal } from "react-bootstrap";
import {FaHeart, FaHeartbeat, FaTint, FaWeight, FaPlus, FaFileExport} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./HealthLogs.css";
import axiosInstance from "../api/axiosInstance";

/* ================= HELPERS ================= */
const getCurrentUserId = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u?._id || u?.id || null;
  } catch {
    return null;
  }
};

// 🤖 Groq AI se insights fetch karo
const fetchAIInsights = async (vitals = {}) => {
  try {
    const params = new URLSearchParams();
    if (vitals?.bloodPressure?.systolic && vitals?.bloodPressure?.diastolic)
      params.append("bp", `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`);
    if (vitals?.sugar) params.append("sugar", vitals.sugar);
    if (vitals?.weight) params.append("weight", vitals.weight);

    const res = await API.get(`/api/ai/nutrition?${params.toString()}`);
    const data = res.data;

    // AI response ko insights format mein convert karo
    const insights = [];
    if (data.advice && Array.isArray(data.advice)) {
      data.advice.forEach((a) => {
        const type =
          a.status === "Critical" || a.status === "High" ? "warning" :
          a.status === "Low" ? "info" : "good";
        insights.push({ type, text: a.tip, category: a.category });
      });
    }
    if (insights.length === 0)
      insights.push({ type: "good", text: data.summary || "All vitals are within healthy range" });

    return { insights, summary: data.summary, overallStatus: data.overallStatus };
  } catch (err) {
    // Fallback agar API fail ho
    return {
      insights: [{ type: "info", text: "AI analysis unavailable — check your vitals manually." }],
      summary: "",
      overallStatus: "Unknown"
    };
  }
};

/* ================= METRIC COMPONENT ================= */
const Metric = ({ icon, label, value }) => (
  <div className="metric-card">
    <div className="metric-icon">{icon}</div>
    <div className="metric-info">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
    </div>
  </div>
);

/* ================= PAGE ================= */
export default function HealthLogs() {
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showAddVitalsModal, setShowAddVitalsModal] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  // 🚨 Emergency detection state — kaunsa log abhi check ho raha hai
  const [emergencyChecking, setEmergencyChecking] = useState(null);

  const [vitalsForm, setVitalsForm] = useState({
    systolic: "", diastolic: "", sugar: "", weight: "", heartRate: ""
  });
  const [noteText, setNoteText] = useState("");

  const currentUserIdRef = useRef(getCurrentUserId());
  const displayedLogs = showAll ? logs : logs.slice(0, 3);

  const healthTips = [
    { icon: <LuDroplets />, text: "Stay Hydrated", desc: "Aim for 8 glasses of water daily.", color: "#3b82f6" },
    { icon: <LuFootprints />, text: "Post-Meal Walk", desc: "A 10-15 min stroll aids digestion.", color: "#10b981" },
    { icon: <LuMoon />, text: "Sleep Hygiene", desc: "Maintain a consistent sleep cycle.", color: "#8b5cf6" },
    { icon: <LuWind />, text: "Deep Breathing", desc: "Reduce stress with 5-min mindfulness.", color: "#f59e0b" },
  ];

  /* ================= LOAD FAMILIES ================= */
  useEffect(() => {
    async function loadFamilies() {
      try {
        const res = await API.get("/api/family/my-families");
        setFamilies(res.data || []);
        if (res.data?.length === 1) setSelectedFamily(res.data[0]._id);
      } catch (err) {
        console.error("Error loading families:", err);
        toast.error("Failed to load family data");
      }
    }
    loadFamilies();
  }, []);

  /* ================= LOAD LOGS ================= */
  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const url = selectedFamily
          ? `/api/healthlogs/family/${selectedFamily}?onlyMine=false`
          : `/api/healthlogs/me`;
        const res = await API.get(url);
        setLogs(res.data?.logs || []);
      } catch (err) {
        console.error("Error loading logs:", err);
        toast.error("Failed to load health logs");
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [selectedFamily]);

  /* ================= EMERGENCY AI CHECK ================= */
  // logId diya ho to specific log/family check hoga (manual "Alert" click se),
  // warna logged-in user ke apne latest logs check honge (auto, vitals save ke baad).
  const checkEmergency = async (logId = null) => {
    try {
      setEmergencyChecking(logId || "latest");

      const url = logId
        ? `/api/healthlogs/emergency/detect/${logId}`
        : `/api/healthlogs/emergency/detect`;

      const res = await API.get(url);
      const data = res.data;

      if (data.isEmergency) {
        toast.error(
          `🚨 ${data.emergencyLevel || "Emergency"} detected! Family ko alert email bhej diya gaya hai.`,
          { autoClose: 6000 }
        );
      } else if (data.message) {
        // e.g. "No recent health logs found."
        toast.info(data.message);
      } else {
        toast.success("✅ Vitals normal — no emergency detected.");
      }

      return data;
    } catch (err) {
      console.error("Emergency check error:", err);
      toast.error("Emergency check fail ho gaya. Dobara try karein.");
      return null;
    } finally {
      setEmergencyChecking(null);
    }
  };

  /* ================= SAVE VITALS ================= */
  const saveVitals = async () => {
    const payload = {
      familyId: selectedFamily || (families[0]?._id || null),
      vitals: {
        bloodPressure: {
          systolic: Number(vitalsForm.systolic) || 0,
          diastolic: Number(vitalsForm.diastolic) || 0,
        },
        sugar: vitalsForm.sugar ? Number(vitalsForm.sugar) : "",
        weight: vitalsForm.weight ? Number(vitalsForm.weight) : "",
        heartRate: vitalsForm.heartRate ? Number(vitalsForm.heartRate) : "",
      },
      notes: noteText,
      date: new Date(),
    };

    if (!payload.familyId) {
      toast.error("No family selected!");
      return;
    }

    const { systolic, diastolic, sugar, heartRate } = payload.vitals;
    if (systolic >= 180 || diastolic >= 120 || sugar >= 300 || heartRate >= 120) {
      toast.warn("🚨 Critical vitals detected! Seek immediate medical attention.");
    }

    setLoading(true);
    try {
      const res = await API.post("/api/healthlogs", payload);
      const newLog = res.data.log || res.data;

      setLogs(prev => [newLog, ...prev]);
      setVitalsForm({ systolic: "", diastolic: "", sugar: "", weight: "", heartRate: "" });
      setNoteText("");
      setShowAddVitalsModal(false);
      toast.success("Vitals logged successfully!");

      // 🤖 Naya vital save hone ke baad automatically AI emergency check karo.
      // Agar AI ko emergency lage to backend khud family ko email bhej dega.
      if (newLog?._id) {
        checkEmergency(newLog._id);
      } else {
        checkEmergency(); // fallback: logged-in user ke latest logs check karo
      }
    } catch (err) {
      console.error("Error saving vitals:", err);
      toast.error("Failed to save vitals");
    } finally {
      setLoading(false);
    }
  };

  const latest = logs[0]?.vitals || {};

  // 🤖 Latest vitals ke saath AI insights fetch karo
  useEffect(() => {
    if (!logs.length) return;
    setAiLoading(true);
    fetchAIInsights(logs[0]?.vitals || {})
      .then((result) => setAiInsights(result.insights || []))
      .finally(() => setAiLoading(false));
  }, [logs]);

  /* ================= EXPORT PDF ================= */
  const exportHealthReportPDF = async () => {
    if (!logs.length) return toast.error("No health data available");

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.text("Health Vitals Report", pageWidth / 2, 18, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 25, { align: "center" });

    let currentY = 32;

    const chartEl = document.getElementById("health-chart-export");
    if (chartEl) {
      const canvas = await html2canvas(chartEl, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.setFontSize(14);
      doc.text("Vitals Trend Chart", 10, currentY);
      currentY += 6;
      doc.addImage(imgData, "PNG", 10, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10;
    }

    doc.setFontSize(14);
    doc.text("AI Health Insights", 10, currentY);
    currentY += 8;
    doc.setFontSize(11);
    aiInsights.forEach(i => {
      const icon = i.type === "warning" ? "⚠" : i.type === "good" ? "✔" : "ℹ";
      doc.text(`${icon} ${i.text}`, 12, currentY);
      currentY += 7;
    });

    currentY += 5;
    autoTable(doc, {
      startY: currentY,
      head: [["Date","Time","Blood Pressure","Heart Rate","Blood Sugar","Weight"]],
      body: logs.slice(0, 5).map(log => [
        new Date(log.date).toLocaleDateString(),
        new Date(log.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        `${log.vitals?.bloodPressure?.systolic || "--"}/${log.vitals?.bloodPressure?.diastolic || "--"}`,
        log.vitals?.heartRate || "--",
        log.vitals?.sugar || "--",
        log.vitals?.weight || "--"
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.setFontSize(9);
    doc.text("Powered by AI Health Intelligence", pageWidth / 2, 290, { align: "center" });
    doc.save("health-report.pdf");
    toast.success("Health report exported as PDF");
  };

  return (
    <div className="health-dashboard">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
      <div className="health-content">
        {/* HEADER */}
        <div className="health-header">
          <div>
            <h1>Health Dashboard</h1>
            <p>Welcome back! Here's an overview of your health metrics.</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline-secondary" onClick={exportHealthReportPDF}>
              <FaFileExport /> Export
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddVitalsModal(true)}>
              <FaPlus /> Log Vital
            </button>
          </div>
        </div>

        {/* FAMILY SWITCHER */}
        {families.length > 1 && (
          <div className="family-selector-container">
            <div className="selector-label">
              <LuUsers size={16} />
              <span>Switch Member</span>
            </div>
            <div className="profile-scroll-wrapper">
              {families.map(f => (
                <button key={f._id} className={`profile-tab ${selectedFamily === f._id ? "is-active" : ""}`} onClick={() => setSelectedFamily(f._id)}>
                  <div className="avatar-mini">{f.name.charAt(0).toUpperCase()}</div>
                  <span className="profile-name">{f.name}</span>
                  {selectedFamily === f._id && <div className="active-dot" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* METRICS GRID */}
        <div className="metrics-grid">
          <Metric icon={<FaHeart />} label="Blood Pressure" value={latest?.bloodPressure ? `${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic}` : "--"} />
          <Metric icon={<FaHeartbeat />} label="Heart Rate" value={latest?.heartRate || "--"} />
          <Metric icon={<FaTint />} label="Blood Sugar" value={latest?.sugar || "--"} />
          <Metric icon={<FaWeight />} label="Weight" value={latest?.weight || "--"} />
        </div>

        {/* AI INSIGHTS */}
        <div className="ai-insights-container">
          <div className="ai-header">
            <div className="ai-title">
              <div className="ai-icon-pulse"><LuBrainCircuit size={20} /></div>
              <div><h4 style={{color:'white'}}>AI Health Intelligence</h4><p>Real-time analysis based on your latest vitals</p></div>
            </div>
          </div>
          <div className="insights-grid-modern">
            {aiLoading ? (
              <div style={{color:'white', padding:'1rem'}}>🤖 AI analyzing your vitals...</div>
            ) : (aiInsights.length > 0 ? aiInsights : [{ type: "good", text: "Log your vitals to get AI health insights." }]).map((i, idx) => {
              const config = {
                warning: { icon: <LuTriangleAlert />, label: "Urgent Action", class: "is-warning" },
                good: { icon: <LuCircleCheck />, label: "Optimal", class: "is-good" },
                info: { icon: <LuInfo />, label: "Observation", class: "is-info" }
              }[i.type] || { icon: <LuLightbulb />, label: "Tip", class: "is-info" };
              return (
                <div key={idx} className={`insight-card-modern ${config.class}`}>
                  <div className="insight-top"><span className="insight-badge">{config.icon}{config.label}</span></div>
                  <div className="insight-body"><p>{i.text}</p></div>
                  <div className="insight-footer"><span>Powered by Groq AI</span></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QUICK TIPS */}
        <div className="tips-container-modern">
          <div className="tips-header">
            <div className="title-group"><LuSparkles className="sparkle-icon" /><h4>Daily Wellness Tips</h4></div>
            <span className="badge-today">Today</span>
          </div>
          <div className="tips-grid">
            {healthTips.map((tip, idx) => (
              <div key={idx} className="tip-card" style={{ '--accent': tip.color , background:'#95aeff' }}>
                <div className="tip-icon-wrapper">{tip.icon}</div>
                <div className="tip-content"><h6>{tip.text}</h6><p style={{color:'GrayText'}}>{tip.desc}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? <Spinner className="mt-5" /> : logs.length === 0 ? (
          <div className="empty-state">
            <FaHeartbeat /><h4>No data available</h4>
            <p>Start logging your vitals to see trends and insights.</p>
            <button className="btn btn-outline-primary" onClick={() => setShowAddVitalsModal(true)}><FaPlus /> Log Your First Vital</button>
          </div>
        ) : (
          <>
            <div className="chart-wrapper" id="health-chart-export"><WeeklyVitalsChart /></div>
            <div className="health-history-container">
              {/* Activity Feed */}
              <div className="history-header-modern">
                <div className="title-stack"><h4>Recent Activity</h4><p>Showing {showAll ? 'all records' : 'latest 3 entries'}</p></div>
                <button className="view-all-link" onClick={() => setShowAll(!showAll)}>
                  {showAll ? "Show Less" : "View All"} <LuChevronRight size={16} style={{ transform: showAll ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }} />
                </button>
              </div>
              <div className="activity-feed">
                {displayedLogs.map(log => {
                  const s = Number(log.vitals?.bloodPressure?.systolic || 0);
                  const sugar = Number(log.vitals?.sugar || 0);
                  const isCritical = s >= 140 || sugar >= 200;
                  const isThisChecking = emergencyChecking === log._id;
                  return (
                    <div className={`activity-row-card ${isCritical ? 'status-alert' : 'status-stable'}`} key={log._id}>
                      <div className="status-strip"></div>
                      <div className="row-main-content">
                        <div className="col-identity">
                          <div className="time-group">
                            <span className="time-text">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="date-text">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="recorded-by">
                            <div className="avatar-circle">{(log.recordedBy?.name || "U")[0]}</div>
                            <span>{log.recordedBy?.name || "You"}</span>
                          </div>
                        </div>
                        <div className="col-vitals-spread">
                          <div className="vital-item"><label>BP</label><div className="value-group"><span className="big-val">{log.vitals?.bloodPressure?.systolic || '--'}</span><span className="slash">/</span><span className="big-val">{log.vitals?.bloodPressure?.diastolic || '--'}</span><span className="unit-text">mmHg</span></div></div>
                          <div className="vital-item"><label>Sugar</label><div className="value-group"><span className="big-val">{log.vitals?.sugar || "--"}</span><span className="unit-text">mg/dL</span></div></div>
                          <div className="vital-item"><label>HR</label><div className="value-group"><span className="big-val">{log.vitals?.heartRate || "--"}</span><span className="unit-text">BPM</span></div></div>
                          <div className="vital-item"><label>Weight</label><div className="value-group"><span className="big-val">{log.vitals?.weight || "--"}</span><span className="unit-text">kg</span></div></div>
                        </div>
                        <div className="col-status-icon">
                          {isCritical ? (
                            <button
                              type="button"
                              className="status-pill alert"
                              onClick={() => checkEmergency(log._id)}
                              disabled={isThisChecking}
                              style={{ border: "none", cursor: isThisChecking ? "not-allowed" : "pointer" }}
                              title="AI se emergency verify karein aur family ko alert email bhejein"
                            >
                              <LuCircleAlert size={12} />{" "}
                              {isThisChecking ? "Checking..." : "Alert"}
                            </button>
                          ) : (
                            <div className="status-pill stable"><LuCircleCheck size={12} /> Stable</div>
                          )}
                        </div>
                      </div>
                      {log.notes && <div className="row-notes"><LuMessageSquare size={14} /><span>{log.notes}</span></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================= MODAL: ADD VITALS ================= */}
      <Modal show={showAddVitalsModal} onHide={() => setShowAddVitalsModal(false)} centered className="modern-vitals-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <div className="header-content">
            <div className="icon-badge"><LuActivity size={24} className="text-primary" /></div>
            <div><h5 className="modal-title fw-bold text-white">Record New Vitals</h5><p className="small mb-0 text-white">Log your current health metrics for AI analysis.</p></div>
          </div>
        </Modal.Header>
        <Modal.Body className="pt-4">
          {families.length > 1 && (
            <div className="form-group-modern mb-4">
              <label className="form-label-modern"><LuUsers className="me-2" /> Member Profile</label>
              <select className="form-select-modern" value={selectedFamily} onChange={e => setSelectedFamily(e.target.value)}>
                <option value="">Select Family Member</option>
                {families.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            </div>
          )}
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label-modern"><LuHeart className="me-2" /> Blood Pressure (mmHg)</label>
              <div className="dual-input-wrapper">
                <input className="input-modern" placeholder="Systolic" value={vitalsForm.systolic} onChange={e => setVitalsForm(p => ({ ...p, systolic: e.target.value }))}/>
                <span className="input-divider">/</span>
                <input className="input-modern" placeholder="Diastolic" value={vitalsForm.diastolic} onChange={e => setVitalsForm(p => ({ ...p, diastolic: e.target.value }))}/>
              </div>
            </div>
            <div className="col-md-6"><label className="form-label-modern"><LuDroplets className="me-2" /> Blood Sugar (mg/dL)</label><input className="input-modern" value={vitalsForm.sugar} onChange={e => setVitalsForm(p => ({ ...p, sugar: e.target.value }))}/></div>
            <div className="col-md-6"><label className="form-label-modern"><LuScale className="me-2" /> Weight (kg)</label><input className="input-modern" value={vitalsForm.weight} onChange={e => setVitalsForm(p => ({ ...p, weight: e.target.value }))}/></div>
            <div className="col-md-6"><label className="form-label-modern"><FaHeartbeat className="me-2" /> Heart Rate (BPM)</label><input className="input-modern" value={vitalsForm.heartRate} onChange={e => setVitalsForm(p => ({ ...p, heartRate: e.target.value }))}/></div>
            <div className="col-12"><label className="form-label-modern"><LuStickyNote className="me-2" /> Notes</label><textarea className="input-modern" value={noteText} onChange={e => setNoteText(e.target.value)}></textarea></div>
            <div className="col-12 text-end"><button className="btn btn-primary" onClick={saveVitals}>Save Vitals</button></div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
