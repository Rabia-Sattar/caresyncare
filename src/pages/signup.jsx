import React, { useState, useContext } from "react";
import API from "../api/axiosinstance";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { Eye, EyeOff } from "lucide-react";
import "./auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.post("/api/auth/register", {
        name, email, phone, password, role,
      });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "15px" }}>
        <h3 className="text-center mb-4 text-primary">Create an Account ✨</h3>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input type="text" className="form-control" placeholder="Enter your full name"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" placeholder="Enter your email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {/* PHONE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input type="text" className="form-control" placeholder="Enter your phone number"
              value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          {/* PASSWORD with show/hide */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                placeholder="Enter a secure password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6c757d", padding: 0 }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ROLE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Role</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <Link to="/login" className="text-primary fw-semibold text-decoration-none">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
