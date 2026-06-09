import React, { useState } from "react";
import API from "../api/axiosinstance";
import { Link } from "react-router-dom";
import "./auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { data } = await API.post("/api/password/forgot", { email });
      setMessage(data.message || "Password reset link sent to your email. Please check your inbox.");
      setEmail("");
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setError("No account found with this email address.");
      } else if (status === 500) {
        setError("Failed to send email. Please try again later.");
      } else {
        setError(err.response?.data?.message || "Failed to send reset link.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "15px" }}>
        <h3 className="text-center mb-3 text-primary">Forgot Password 🔑</h3>
        <p className="text-center text-muted mb-4">
          Enter your registered email address. We'll send you a password reset link.
        </p>

        {message && (
          <div className="alert alert-success text-center">
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" />
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none text-primary fw-semibold">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
