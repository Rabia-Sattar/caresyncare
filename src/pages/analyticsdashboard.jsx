import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  ProgressBar,
  Button,
  Spinner,
  Alert
} from "react-bootstrap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";
import {
  FaTasks,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import API from "../api/axiosinstance";
import "./analyticsdashboard.css";
import { Link } from "react-router-dom";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------------
  // FETCH ANALYTICS FROM BACKEND
  // -------------------------------
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/api/analytics/me");
        console.log("FULL ANALYTICS RESPONSE:", res.data);   // 👈 add this
        console.log("WEEKLY TASKS:", res.data.weeklyTasks);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <div className="loader-container">
        <Spinner animation="grow" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );

  const { summary, weeklyTasks = [], taskTypes = [] } = data;

  return (
    <Container fluid className="analytics-container p-4">
      <header className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark">CareSync Performance Analytics</h2>
          <p className="text-muted">
            Insights into task completion, reminders & care efficiency
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <Row className="g-4 mb-4">
        {[
          {
            title: "Completion Rate",
            value: `${summary.completionRate || 0}%`,
            icon: <FaCheckCircle />,
            color: "success",
            trend: summary.completionRateChange || "+0%"
          },
          {
            title: "Total Tasks",
            value: summary.totalTasks || 0,
            icon: <FaTasks />,
            color: "primary",
            trend: summary.totalTasksChange || "0"
          },
          {
            title: "Completed Tasks",
            value: summary.completedTasks || 0,
            icon: <FaCheckCircle />,
            color: "info",
            trend: summary.completedTasksChange || "+0"
          },
          {
            title: "Reminders Completed",
            value: `${summary.completedReminders || 0}/${summary.totalReminders || 0}`,
            icon: <FaExclamationTriangle />,
            color: "warning",
            trend: summary.overdueReminders || 0
          }
        ].map((card, idx) => (
          <Col key={idx} lg={3} md={6}>
            <Card className="kpi-card border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  <div className={`icon-box bg-${card.color}-soft text-${card.color}`}>
                    {card.icon}
                  </div>
                  <Badge
                    pill
                    bg="light"
                    text={card.trend >= 0 ? "success" : "danger"}
                    className="trend-badge"
                  >
                    {card.trend > 0 ? <FaArrowUp /> : <FaArrowDown />} {card.trend}
                  </Badge>
                </div>
                <h6 className="text-muted">{card.title}</h6>
                <h3 className="fw-bold">{card.value}</h3>
                <ProgressBar
                  now={
                    card.title === "Reminders Completed" && summary.totalReminders
                      ? (summary.completedReminders / summary.totalReminders) * 100
                      : summary.completionRate
                  }
                  variant={card.color}
                  className="mt-3 rounded-pill"
                />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


      {/* Charts */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="chart-card border-0 shadow-sm p-4"style={{background:'#0f172a'}}>
            <h6 className="fw-bold mb-4 text-white">Weekly Task Activity</h6>
            <ResponsiveContainer width="100%" height={300} >
              <AreaChart data={weeklyTasks} >
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorTasks)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="chart-card border-0 shadow-sm p-4 text-center" >
            <h6 className="fw-bold mb-4">Task Breakdown</h6>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={taskTypes}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                >
                  {taskTypes.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Critical Section */}
      <Row>
        <Col>
          <div className="critical-section p-4 rounded-4 shadow-sm d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 text-danger">
                <FaExclamationTriangle className="me-2" />
                Immediate Attention Required
              </h5>
              <p className="mb-0 text-muted">
                {summary.overdueTasks || 0} tasks are overdue. Please review and take action.
              </p>
            </div>
          <Link to="/tasks">
  <Button variant="danger" className="px-4">
    Resolve Now
  </Button>
</Link>
          </div>
        </Col>
      </Row>

    </Container>
  );
};

export default AnalyticsDashboard;
