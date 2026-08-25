import React, { useState } from "react";
import axiosInstance from "../Component/BaseComponent/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
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
      const response = await axiosInstance.post(
        "/signin",
        formData
      );
      setSuccess("Login successful!");
      localStorage.setItem("token", response.data.jwtToken);
      localStorage.setItem("companyId", response.data.companyId);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem(
        "moduleAccess",
        JSON.stringify(response.data.moduleAccess)
      );
      setTimeout(async () => {
        try {
          const moduleResponse = await axiosInstance.get("/module/getAllModule");
          const modules = moduleResponse.data || [];
          let sortedModules = [...modules].sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

          const role = response.data.role;
          const moduleAccess = response.data.moduleAccess || [];

          if (role === "ROLE_EMPLOYEE") {
            sortedModules = sortedModules.filter((module) => {
              const access = moduleAccess.find(
                (item) => String(item.moduleId) === String(module.id)
              );
              return access?.canView === true;
            });
          }

          let canSeeEmployee = false;
          if (role === "ROLE_ADMIN") {
            canSeeEmployee = true;
          } else {
            const empAccess = moduleAccess.find((item) => item.moduleId === "EMPLOYEE_MANAGEMENT");
            if (empAccess?.canView === true) {
              canSeeEmployee = true;
            }
          }

          if (role === "ROLE_EMPLOYEE" && canSeeEmployee) {
            navigate("/employee");
          } else if (sortedModules.length > 0) {
            const firstModule = sortedModules[0];
            const targetPath = `/${firstModule.moduleKey || firstModule.name}/${firstModule.id}`;
            navigate(targetPath);
          } else {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching modules after login:", error);
          navigate("/dashboard");
        }
      }, 800);
    } catch (err) {
      setError(err.response?.data || "An error occurred during login");
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
          <h2 className="mt-3 mb-1" style={{ fontSize: "1.75rem", fontFamily: "var(--font-heading)" }}>Welcome Back</h2>
          <p className="text-secondary small">Enter your credentials to access your portal</p>
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
              placeholder="Your username"
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
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-secondary small mb-0">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


