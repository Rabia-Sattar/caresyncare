import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosinstance";
import { Eye, EyeOff } from "lucide-react";
import "./auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post(`/api/password/reset/${token}`, { password });
      setMessage(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) {
        setError("Reset link is invalid or has expired. Please request a new one.");
      } else {
        setError(err.response?.data?.message || "Error resetting password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}>
        <h3 className="text-center mb-4 text-primary">Reset Password 🔒</h3>

        {message && <div className="alert alert-success text-center">✅ {message}<br/><small>Redirecting to login...</small></div>}
        {error && <div className="alert alert-danger text-center">❌ {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6c757d", padding: 0 }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="position-relative">
              <input
                type={showConfirm ? "text" : "password"}
                className="form-control pe-5"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6c757d", padding: 0 }}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Resetting...</> : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/forgot-password" className="text-decoration-none text-primary">
            Request new reset link
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
