import React, { useEffect, useState } from "react";
import API from "../api/axiosinstance";

const Analytics = ({ familyId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get(`/api/analytics/family/${familyId}`);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        alert(err.response?.data?.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    if (familyId) fetchAnalytics();
  }, [familyId]);

  if (loading) return <p>Loading analytics...</p>;
  if (!analytics) return <p>No analytics available</p>;

  return (
    <div>
      <h2>Family Analytics</h2>
      <p>Total Tasks: {analytics.totalTasks}</p>
      <p>Completed Tasks: {analytics.completedTasks}</p>
      <p>In Progress: {analytics.inProgressTasks}</p>
      <p>Pending Tasks: {analytics.pendingTasks}</p>
      <p>Urgent Tasks: {analytics.urgentTasks}</p>

      <h4>AI Workload Scores</h4>
      <ul>
        {analytics.aiScores.map(u => (
          <li key={u.userId}>
            UserID: {u.userId} - Score: {u.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Analytics;