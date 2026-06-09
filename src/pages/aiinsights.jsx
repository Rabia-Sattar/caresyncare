import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { FaLightbulb, FaTasks, FaCalendarAlt, FaBell, FaUsers } from "react-icons/fa";
import API from "../api/axiosinstance";
import "./aiinsights.css";


const AIInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch AI Insights from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/ai-insights/me");
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load AI insights.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="loader-container text-center py-5">
        <Spinner animation="grow" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );

  const { healthLogs, tasks, events, reminders, family, overallWellness } = data;

  return (
    <Container fluid className="ai-insights-container py-4">
      {/* Page Header */}
      <header className="mb-5">
        <h2 className="fw-bold">Your AI Insights</h2>
        <p className="text-white">Personalized suggestions based on your recent activity</p>
        {overallWellness && (
          <div className="p-3 rounded-3 mt-3" style={{background:'linear-gradient(135deg,#1e3a5f,#0d6efd)', border:'1px solid #0d6efd'}}>
            <span style={{color:'#7dd3fc', fontWeight:'600', fontSize:'0.85rem'}}>🤖 Groq AI Overall Assessment</span>
            <p className="mb-0 mt-1 text-white">{overallWellness}</p>
          </div>
        )}
      </header>

      {/* Health Logs Suggestions */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="border-0 pt-4 pb-0 d-flex align-items-center" style={{background:'#e8f4ff'}}>
              <div className="p-2 bg-warning bg-opacity-10 rounded-3 me-3">
                <FaLightbulb className="text-warning" size={20} />
              </div>
              <h5 className="mb-0 fw-bold">AI Health Suggestions</h5>
            </Card.Header>
            <Card.Body className="pt-3"  style={{background:'#e8f4ff'}}>
              {healthLogs.length === 0 ? (
                <p className="text-center text-muted py-4 small">No recent health logs to analyze.</p>
              ) : (
                <div className="suggestion-container">
                  {healthLogs.flatMap((log, idx) =>
                    log.suggestions.map((sug, i) => (
                      <div
                        key={`${idx}-${i}`}
                        className="p-3 mb-2 rounded-3 border-start border-4 border-warning " 
                        style={{ fontSize: "0.9rem", background:'#ffffcc' }}
                      >
                        {sug}
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tasks & Family */}
      <Row className="g-3 mb-4">
        {/* Tasks */}
        <Col lg={6} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="border-0 pt-4 pb-2 d-flex justify-content-between align-items-center"  style={{background:'#e8f4ff'}}>
              <div className="d-flex align-items-center">
                <div className="p-2 bg-primary bg-opacity-10 rounded-3 me-3">
                  <FaTasks className="text-primary" size={20} />
                </div>
                <h5 className="mb-0 fw-bold">Task Optimizer</h5>
              </div>
              {tasks.overdue > 0 && (
                <span className="badge rounded-pill bg-danger px-2 py-1">
                  {tasks.overdue} Overdue
                </span>
              )}
            </Card.Header>
            <Card.Body style={{background:'#e8f4ff'}}>
              <div className="d-flex justify-content-around  rounded-3 py-2 mb-4 text-center" style={{background:'#cfe7ff'}} >
                <div >
                  <div className="small text-muted">Total</div>
                  <div className="fw-bold text-dark">{tasks.total}</div>
                </div>
                <div className="border-start"></div>
                <div>
                  <div className="small text-muted">Done</div>
                  <div className="fw-bold text-success">{tasks.completed}</div>
                </div>
              </div>
              <h6 className="small text-uppercase text-muted fw-bold mb-2">Priority Suggestions</h6>
              {tasks.suggestions.length > 0 ? (
                tasks.suggestions.map((s, i) => (
                  <div key={i} className="mb-2 p-2 rounded-2  border-start border-3 border-primary" style={{background:'#afd6ff'}}>
                    {s}
                  </div>
                ))
              ) : (
                <p className="text-muted small">You're all caught up!</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Family Insights */}
        <Col lg={6} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="border-0 pt-4 pb-0 d-flex align-items-center justify-content-between" style={{background:'#e8f4ff'}}>
              <div className="d-flex align-items-center">
                <div className="p-2 bg-info bg-opacity-10 rounded-3 me-3">
                  <FaUsers className="text-info" size={20} />
                </div>
                <h5 className="mb-0 fw-bold">Family Insights</h5>
              </div>
              <small className="text-muted">Weekly Effort</small>
            </Card.Header>
            <Card.Body className="pt-3" style={{background:'#e8f4ff'}}>
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-info fw-bold">You ({family.tasksCompletedByYou})</span>
                  <span className="text-secondary">Others ({family.tasksCompletedByOthers})</span>
                </div>
                <div className="progress" style={{ height: "8px", backgroundColor: "#e9ecef" }}>
                  <div
                    className="progress-bar bg-info rounded-start"
                    style={{
                      width: `${
                        (family.tasksCompletedByYou /
                          (family.tasksCompletedByYou + family.tasksCompletedByOthers || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                  <div
                    className="progress-bar bg-info opacity-25 rounded-end"
                    style={{
                      width: `${
                        (family.tasksCompletedByOthers /
                          (family.tasksCompletedByYou + family.tasksCompletedByOthers || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              {family.suggestions.length > 0 ? (
                family.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="p-2 mb-2 rounded-2 bg-light border-start border-3 border-info"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {s}
                  </div>
                ))
              ) : (
                <p className="text-muted small text-center">Harmony achieved! No new insights.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Schedule Insights & Action Reminders */}
      <Row className="g-3">
        {/* Events */}
        <Col lg={6} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="border-0 pt-4 pb-0 d-flex align-items-center" style={{background:'#e8f4ff'}}>
              <div className="p-2 bg-success bg-opacity-10 rounded-3 me-3">
                <FaCalendarAlt className="text-success" size={20} />
              </div>
              <h5 className="mb-0 fw-bold">Schedule Insights</h5>
            </Card.Header>
            <Card.Body style={{background:'#e8f4ff'}}>
              {events.length === 0 ? (
                <p className="text-center text-muted small py-4">No upcoming events found.</p>
              ) : (
                events.map((ev, idx) => (
                  <div key={idx} className="mb-3 p-2 border-start border-3 border-success  rounded-2" style={{background:'#ddead1'}}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="mb-0 fw-bold">{ev.title}</h6>
                      <small className="text-muted">{new Date(ev.date).toLocaleDateString()}</small>
                    </div>
                    {ev.suggestions.map((s, i) => (
                      <div key={i} className="small text-secondary ms-3">
                        • {s}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Reminders */}
        {/* Reminders */}
<Col lg={6} md={6}>
  <Card className="border-0 shadow-sm h-100 bg-white">
    <Card.Header className="border-0 pt-4 pb-2 d-flex justify-content-between align-items-center" style={{background:'#e8f4ff'}}>
      <div className="d-flex align-items-center">
        <div className="p-2 bg-danger bg-opacity-10 rounded-3 me-3">
          <FaBell className="text-danger" size={20} />
        </div>
        <h5 className="mb-0 fw-bold">Action Reminders</h5>
      </div>
      <span className="badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
        {reminders.length} New
      </span>
    </Card.Header>

    <Card.Body className="pt-2" style={{background:'#e8f4ff'}}>
      {reminders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted small italic mb-0">All clear! No pending reminders.</p>
        </div>
      ) : (
        <div className="reminder-feed">
          {reminders.map((r, idx) => {
            const isOverdue = new Date(r.date) < new Date();
            return (
              <div
                key={idx}
                className={`mb-3 p-3 rounded-3 border-start border-4 ${
                  isOverdue
                    ? "border-danger bg-danger bg-opacity-10"
                    : "border-warning bg-warning bg-opacity-10"
                }`}
              >
                {/* Reminder Header */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6
                    className={`fw-bold ${
                      isOverdue ? "text-danger-emphasis" : "text-warning-emphasis"
                    } mb-0`}
                  >
                    {r.title}
                  </h6>
                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {new Date(r.date).toLocaleDateString()}
                  </small>
                </div>

                {/* Suggestions */}
                <div className="mt-2">
                  {r.suggestions.map((s, i) => (
                    <div key={i} className="d-flex align-items-start mb-1 text-dark-emphasis">
                      <span className="me-2">{isOverdue ? "⚠️" : "•"}</span>
                      <small className="lh-sm">{s}</small>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card.Body>
  </Card>
</Col>

      </Row>
    </Container>
  );
};

export default AIInsights;
