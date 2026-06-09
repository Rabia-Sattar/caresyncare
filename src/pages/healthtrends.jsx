import React, { useEffect, useState } from "react";
import API from "../api/axiosinstance";
import { LuTrendingUp, LuTrendingDown, LuMinus, LuTriangleAlert, LuCircleCheck, LuActivity, LuCalendar } from "react-icons/lu";
import { Spinner } from "react-bootstrap";

const riskColors = { Low: "#22c55e", Medium: "#f59e0b", High: "#ef4444", Critical: "#dc2626" };
const trendIcons = { Increasing: <LuTrendingUp />, Decreasing: <LuTrendingDown />, Stable: <LuMinus /> };

export default function HealthTrends() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/api/ai/health-trends")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load health trend predictions."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><Spinner animation="grow" variant="primary" /></div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!data?.predictions) return (
    <div className="p-4" style={{ background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <div className="text-center py-5">
        <LuActivity size={48} className="mb-3" style={{ color: "#3b82f6" }} />
        <h4>Not Enough Data</h4>
        <p style={{ color: "#94a3b8" }}>{data?.message || "Log at least 2 health entries to see trend predictions."}</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white", padding: "1.5rem" }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">📊 Health Trend Prediction</h2>
        <p style={{ color: "#94a3b8" }}>AI analysis of your {data.logsAnalyzed} health records — {data.periodAnalyzed}</p>
      </div>

      {/* Overall Risk Banner */}
      <div className="p-4 rounded-3 mb-4" style={{ background: `${riskColors[data.overallRisk]}22`, border: `1px solid ${riskColors[data.overallRisk]}` }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: riskColors[data.overallRisk], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            {data.overallRisk === "Low" ? "✅" : data.overallRisk === "Medium" ? "⚠️" : "🚨"}
          </div>
          <div>
            <div style={{ color: riskColors[data.overallRisk], fontWeight: 700 }}>Overall Risk: {data.overallRisk}</div>
            <p className="mb-0" style={{ color: "#e2e8f0", fontSize: "0.9rem" }}>{data.trendSummary}</p>
          </div>
        </div>
      </div>

      {/* Doctor Alert */}
      {data.shouldSeeDoctor && (
        <div className="p-3 rounded-3 mb-4 d-flex gap-3 align-items-start" style={{ background: "#fef2f222", border: "1px solid #ef4444" }}>
          <LuTriangleAlert size={22} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ color: "#ef4444", fontWeight: 600 }}>⚕️ Doctor Visit Recommended</div>
            <p className="mb-0" style={{ color: "#fca5a5", fontSize: "0.875rem" }}>{data.doctorAdvice}</p>
          </div>
        </div>
      )}

      {/* Predictions Grid */}
      <div className="row g-3 mb-4">
        {data.predictions?.map((pred, i) => (
          <div key={i} className="col-md-6">
            <div className="p-3 rounded-3 h-100" style={{ background: "#1e293b", border: `1px solid ${riskColors[pred.riskLevel]}44` }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold" style={{ color: "#e2e8f0" }}>{pred.vital}</h6>
                <span style={{ color: riskColors[pred.riskLevel], fontSize: "0.75rem", fontWeight: 600, background: `${riskColors[pred.riskLevel]}22`, padding: "0.2rem 0.6rem", borderRadius: 20 }}>
                  {pred.riskLevel}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2" style={{ color: pred.currentTrend === "Increasing" ? "#ef4444" : pred.currentTrend === "Decreasing" ? "#22c55e" : "#f59e0b" }}>
                {trendIcons[pred.currentTrend]}
                <span style={{ fontSize: "0.8rem" }}>Trend: {pred.currentTrend}</span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "0.5rem" }}>📈 {pred.prediction}</p>
              <div className="p-2 rounded-2" style={{ background: "#0f172a", fontSize: "0.8rem", color: "#7dd3fc" }}>
                💡 {pred.action}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Recommendations */}
      <div className="p-3 rounded-3" style={{ background: "#1e293b" }}>
        <h6 className="fw-bold mb-3" style={{ color: "#7dd3fc" }}>📅 This Week's Recommendations</h6>
        {data.weeklyRecommendations?.map((rec, i) => (
          <div key={i} className="d-flex align-items-start gap-2 mb-2">
            <LuCircleCheck size={16} style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }} />
            <span style={{ color: "#e2e8f0", fontSize: "0.875rem" }}>{rec}</span>
          </div>
        ))}
      </div>
    </div>
  );
}