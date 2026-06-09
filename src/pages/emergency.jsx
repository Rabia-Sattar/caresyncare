import React, { useState } from "react";
import axiosInstance from "../api/axiosinstance";
import { Container, Card, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { Send, ShieldCheck, Pill, UserSearch, PhoneCall, Radio, AlertTriangle } from "lucide-react";
import "./emergency.css";

const Emergency = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSendAlert = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setSuccess("");
    setError("");

    if (!message.trim()) {
      setError("Please write an emergency message.");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/api/emergency/send", {
        message: message.trim(),
      });

      // ✅ Success — show message and clear form
      if (response.status === 201 || response.status === 200) {
        setSuccess("🚨 Alert successfully broadcasted to your family members!");
        setMessage("");

        // Auto-clear success after 6 seconds
        setTimeout(() => setSuccess(""), 6000);
      }
    } catch (err) {
      // ❌ Show specific error from server or generic
      const serverMsg =
        err?.response?.data?.message || err?.message || "Failed to dispatch alert.";

      if (err?.response?.status === 404) {
        setError(
          "❌ Family not found. Please make sure you are part of a family group before sending an alert."
        );
      } else if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError("❌ You are not authorized. Please log in again.");
      } else if (!navigator.onLine) {
        setError("❌ No internet connection. Please check your network and try again.");
      } else {
        setError(`❌ ${serverMsg}`);
      }

      // Auto-clear error after 8 seconds
      setTimeout(() => setError(""), 8000);
    } finally {
      setLoading(false);
    }
  };

  const protocolTips = [
    {
      icon: <Pill size={24} />,
      title: "Be Specific",
      text: "Mention exact medication names and dosages clearly.",
    },
    {
      icon: <UserSearch size={24} />,
      title: "Identify",
      text: "State the patient's name if multiple people are at home.",
    },
    {
      icon: <PhoneCall size={24} />,
      title: "Prioritize",
      text: "For critical life-safety, call emergency services first.",
    },
    {
      icon: <Radio size={24} />,
      title: "Stay Online",
      text: "Keep the app open to receive family acknowledgments.",
    },
  ];

  return (
    <div className="emergency-dashboard">
      <Container className="py-5">
        {/* ACTION SECTION */}
        <div className="d-flex flex-column align-items-center mb-5">
          <div className="main-alert-header text-center mb-4">
            <h1 className="fw-bold tracking-tight">Emergency Central</h1>
            <p className="text-muted">Direct line to your family safety network</p>
          </div>

          <Card className="central-action-card border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="status-header mb-4">
                <div className="pulse-dot"></div>
                <span className="status-text">System Active & Ready</span>
              </div>

              {/* ✅ Error Alert */}
              {error && (
                <Alert
                  variant="danger"
                  className="modern-alert d-flex align-items-start gap-2"
                  dismissible
                  onClose={() => setError("")}
                >
                  <AlertTriangle size={18} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>{error}</span>
                </Alert>
              )}

              {/* ✅ Success Alert */}
              {success && (
                <Alert
                  variant="success"
                  className="modern-alert d-flex align-items-center gap-2"
                  dismissible
                  onClose={() => setSuccess("")}
                >
                  <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                  <span>{success}</span>
                </Alert>
              )}

              <Form onSubmit={handleSendAlert}>
                <Form.Group className="mb-4">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Describe the situation here... (e.g. Patient is having chest pain and difficulty breathing)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="dispatch-textarea"
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="btn-dispatch"
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="me-2" /> Send Alert
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>

        {/* TIPS SECTION */}
        <div className="protocol-container">
          <Row className="g-3">
            {protocolTips.map((tip, index) => (
              <Col key={index} md={6} lg={3}>
                <div className="protocol-card">
                  <div className="protocol-icon mb-3">{tip.icon}</div>
                  <h6 className="fw-bold mb-2" style={{ color: "white" }}>
                    {tip.title}
                  </h6>
                  <p className="small mb-0" style={{ color: "white" }}>
                    {tip.text}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Emergency;
