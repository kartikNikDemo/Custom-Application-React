import React, { useState } from "react";
import axiosInstance from "../Component/BaseComponent/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axiosInstance.post("/register", formData);
      setSuccess("Registration successful!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data || "An error occurred during registration");
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center position-relative overflow-hidden fade-in-el">
      {/* Background glow layers */}
      <div className="bg-glow-container">
        <div className="glow-circle glow-circle-1"></div>
        <div className="glow-circle glow-circle-2"></div>
      </div>

      <div className="glass-card p-5 w-100 m-3" style={{ maxWidth: "440px" }}>
        <div className="text-center mb-4">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="fs-3 fw-bold gradient-text-neon" style={{ fontFamily: "var(--font-heading)" }}>
              PortalFlow
            </span>
          </Link>
          <h2 className="mt-3 mb-1" style={{ fontSize: "1.75rem", fontFamily: "var(--font-heading)" }}>Create Account</h2>
          <p className="text-secondary small">Sign up to get access to your portal</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-4 d-flex align-items-center" role="alert" style={{ fontSize: "0.9rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "var(--danger)" }}>
            <span className="me-2">⚠️</span> {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success py-2 px-3 mb-4 d-flex align-items-center" role="alert" style={{ fontSize: "0.9rem", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--success)" }}>
            <span className="me-2">✓</span> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="form-control"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-premium w-100 py-3 mt-2">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-secondary small mb-0">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
