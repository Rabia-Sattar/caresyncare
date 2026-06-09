import React, { useEffect, useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { LuTrendingUp, LuInfo } from "react-icons/lu";
import API from "../api/axiosinstance";
import "./weeklyvitalschart.css";


export default function WeeklyVitalsChart({ familyId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        let url = "/api/healthlogs/me";
        if (familyId) url = `/api/healthlogs/family/${familyId}?onlyMine=true`;

        const res = await API.get(url);
        const data = res.data?.logs || res.data || [];

        // Prepare chart data for last 7 logs
        const chartData = data
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-7)
          .map((log) => ({
            date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            systolic: log.vitals?.bloodPressure?.systolic || 0,
            diastolic: log.vitals?.bloodPressure?.diastolic || 0,
            sugar: log.vitals?.sugar || 0,
            weight: log.vitals?.weight || 0,
            heartRate: log.vitals?.heartRate || 0,
          }));

        setLogs(chartData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [familyId]); // ✅ re-fetch when family changes

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-date">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="tooltip-item">
              <span className="dot" style={{ backgroundColor: entry.color }}></span>
              <span className="name">{entry.name}:</span>
              <span className="val">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="chart-loader">Loading analytics...</div>;

  return (
    <div className="chart-card-modern">
      <div className="chart-header">
        <div className="title-box">
          <div className="icon-circle"><LuTrendingUp size={18} /></div>
          <div>
            <h5>Vital Statistics</h5>
            <p>Visualizing your health trends over the last 7 logs</p>
          </div>
        </div>
        <LuInfo className="text-muted cursor-pointer" size={18} />
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              dy={10}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />

            {/* Blood Pressure */}
            <Area type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBP)" name="Systolic" />
            <Area type="monotone" dataKey="diastolic" stroke="#60a5fa" strokeWidth={3} fill="transparent" name="Diastolic" />

            {/* Heart Rate */}
            <Area type="monotone" dataKey="heartRate" stroke="#8b5cf6" strokeWidth={3} fill="transparent" name="Heart Rate" />

            {/* Sugar */}
            <Area type="monotone" dataKey="sugar" stroke="#f97316" strokeWidth={3} fill="url(#colorSugar)" name="Sugar" />

            {/* Weight */}
            <Area type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={3} fill="url(#colorWeight)" name="Weight" />

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}